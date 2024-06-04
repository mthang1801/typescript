import MetaTrader5 as mt5
import pandas as pd
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)
pd.set_option('display.width', 1000)

# In ra thư mục hiện tại
print("Thư mục hiện tại:", os.getcwd())


# Hàm đăng nhập và đọc thông tin tài khoản
def login_and_get_balance(account, password, server):
    if not mt5.login(account, password, server):
        print(f"Lỗi khi đăng nhập vào tài khoản {account}")
        return {"account": account, "balance": None, "error": "Lỗi khi đăng nhập"}
   
    account_info = mt5.account_info()
    if account_info is None:
        print(f"Lỗi khi lấy thông tin tài khoản {account}")
        return {"account": account, "balance": None, "error": "Lỗi khi lấy thông tin"}
  
    return {"account": account, password: password, "balance": account_info.balance, "error": None}

# Truy xuất lịch sử giao dịch
def fetch_trades_history(from_date, to_date):   
    # Lấy lịch sử các lệnh giao dịch
    # history = mt5.history_deals_get(from_date, to_date)
    # history = mt5.history_orders_get(from_date, to_date)   
    history = mt5.positions_get(symbol='*')   
    print(history)      
    # if history:
    #   df = pd.DataFrame(list(history), columns=history[0]._asdict().keys())
    # print(df)


# Khởi tạo MetaTrader 5
try:
    if not mt5.initialize():
        print("Lỗi khi khởi tạo MetaTrader 5", mt5.last_error())
        mt5.shutdown()
        exit()
    else:
        print("Khởi tạo MetaTrader 5 thành công")
except Exception as e:
    print(f"Lỗi khi khởi tạo MetaTrader 5: {e}")
    mt5.shutdown()
    exit()

# Đọc tệp Excel chứa thông tin tài khoản
try:
    df = pd.read_excel("D:/mvt/typescript/src/accounts.xlsx")  # Sử dụng đường dẫn tuyệt đối
    print("Đọc tệp Excel thành công")
    print(df)  # In ra DataFrame để kiểm tra
except Exception as e:
    print(f"Lỗi khi đọc tệp Excel: {e}")
    mt5.shutdown()
    exit()

# Tạo danh sách để lưu kết quả
results = []

# Quyết định số lượng luồng (ở đây đặt là 6 luồng)
num_threads = 6
print(f"Số lượng luồng được sử dụng: {num_threads}")

# Sử dụng ThreadPoolExecutor để thực hiện các tác vụ song song
with ThreadPoolExecutor(max_workers=num_threads) as executor:
    futures = []
    for index, row in df.iterrows():
        account = row['account']
        password = row['password']
        server = row['server']
        futures.append(executor.submit(login_and_get_balance, account, password, server))        
         # Đặt khoảng thời gian để lấy lịch sử giao dịch
        from_date = pd.Timestamp("2024-05-01").to_pydatetime()
        to_date = pd.Timestamp.now().to_pydatetime()
        fetch_trades_history(from_date, to_date)
    for future in as_completed(futures):
        result = future.result()
        results.append(result)

# Đóng kết nối MetaTrader 5
mt5.shutdown()

# Tạo DataFrame từ kết quả
results_df = pd.DataFrame(results)
print("Danh sách kết quả:", results_df)  # In ra danh sách kết quả để kiểm tra

# Xuất kết quả ra tệp Excel mới
try:
    results_df.to_excel("D:/mvt/typescript/src/account_balances.xlsx", index=False)
    print("Kết quả đã được xuất ra tệp account_balances.xlsx")
except Exception as e:
    print(f"Lỗi khi xuất tệp Excel: {e}")

