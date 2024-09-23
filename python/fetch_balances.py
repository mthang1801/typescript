import MetaTrader5 as mt5
import pandas as pd
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
import schedule
import time
import telegram  
import asyncio
from tabulate import tabulate
from py_markdown_table.markdown_table import markdown_table

pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)
pd.set_option('display.width', 1000)

TOKEN="6203189889:AAGGhFcKjs7bjYJvEMW2c4RJnpKYg56gTA8"
CHAT_ID="-1002026878772"
FILE_INPUT_URL= "D:/local/typescript/src/accounts.xlsx"
FILE_OUTPUT_URL= "D:/local/typescript/src/accounts_output.xlsx"
EXECUTE_FROM_DATE= "2024-07-01"
OFFSET_AT_LEAST_BALANCE_ACCOUNT=2
NUM_THREADS=2
TIMEOUT= 60000
MIN_BALANCE_REQUIRMENT=1000000000
SEND_MESSAGE_TABLE_LIST=["account","balance","server"]

# Hàm đăng nhập và đọc thông tin tài khoản
def login_and_get_balance(account, password, server):
    if not mt5.login(account, password, server):
        print(f"Lỗi khi đăng nhập vào tài khoản {account}")
        return {"account": account, "balance": None, "error": "Lỗi khi đăng nhập"}
  
    account_info = mt5.account_info()
    if account_info is None:
        print(f"Lỗi khi lấy thông tin tài khoản {account}")
        return {"account": account, "balance": None, "error": "Lỗi khi lấy thông tin", "server" : server}
  
    return {"account": account, password: password, "balance": account_info.balance, "error": None, "server" : server}

# Truy xuất lịch sử giao dịch
def fetch_trades_history(from_date, to_date):   
    # Lấy lịch sử các lệnh giao dịch
    history = mt5.history_deals_get(from_date, to_date)
    history = mt5.history_orders_get(from_date, to_date)   
    history = mt5.positions_get(symbol='*')   
    if history:
      df = pd.DataFrame(list(history), columns=history[0]._asdict().keys())
      return df
      
def initMt5():    
    # display data on the MetaTrader 5 package
    print("MetaTrader5 package author: ",mt5.__author__)
    print("MetaTrader5 package version: ",mt5.__version__)
    # Khởi tạo MetaTrader 5
    try:
        if not mt5.initialize(timeout=TIMEOUT):
            print("Lỗi khi khởi tạo MetaTrader 5", mt5.last_error())
            mt5.shutdown()
            exit()
        else:
            print("Khởi tạo MetaTrader 5 thành công")
    except Exception as e:
      print(f"Lỗi khi khởi tạo MetaTrader 5: {e}")
      mt5.shutdown()
      exit()
      
def send_test_message(message):
    print("send_test_message")
    try:
        telegram_notify = telegram.Bot(token = TOKEN)    
        asyncio.run(telegram_notify.send_message(chat_id=CHAT_ID, text=message,
                                parse_mode='Markdown'))
    except Exception as e:
        print(e)

def readDataFromFile(file): 
    # Đọc tệp Excel chứa thông tin tài khoản
    try:
        df = pd.read_excel(file)  # Sử dụng đường dẫn tuyệt đối
        print("Đọc tệp Excel thành công")        
        return df;
    except Exception as e:
        print(f"Lỗi khi đọc tệp Excel: {e}")
        mt5.shutdown()
        exit()
        
def findAccountListBeloveMinBalanceRequire(accounts, offset = OFFSET_AT_LEAST_BALANCE_ACCOUNT) :
  return accounts[accounts["balance"] < MIN_BALANCE_REQUIRMENT]; 
  
def notifyTelegramAccount(accounts):  
  data  = accounts.loc[:,SEND_MESSAGE_TABLE_LIST];
  # data = accounts.to_dict("records")
  markdown = markdown_table(data.to_dict("records")).get_markdown()
  # print(markdown)
  send_test_message(str(markdown))
    
def main():
  # In ra thư mục hiện tại
  print("Thư mục hiện tại:", os.getcwd())
  
  print("(1) Khởi tạo MetaTrader5")
  initMt5()

  print(f"(2) Đọc file {FILE_INPUT_URL}")
  df = readDataFromFile(FILE_INPUT_URL)
  print(df)  # In ra DataFrame để kiểm tra
  
  # Tạo danh sách để lưu kết quả
  results = []
  
  # Sử dụng ThreadPoolExecutor để thực hiện các tác vụ song song
  with ThreadPoolExecutor(max_workers=NUM_THREADS) as executor:
      print(f"Số lượng luồng được sử dụng: {NUM_THREADS}")
      futures = []
      for index, row in df.iterrows():
          account = row['account']
          password = row['password']
          server = row['server']
          futures.append(executor.submit(login_and_get_balance, account, password, server))        
          # Đặt khoảng thời gian để lấy lịch sử giao dịch
          from_date = pd.Timestamp(EXECUTE_FROM_DATE).to_pydatetime()
          to_date = pd.Timestamp.now().to_pydatetime()
          fetch_trades_history(from_date, to_date)
      for future in as_completed(futures):
          result = future.result()
          results.append(result)                 
  
  # Đóng kết nối MetaTrader 5
  mt5.shutdown()
  # Tạo DataFrame từ kết quả  
  results_df = pd.DataFrame(results)    
  belowBalanceRequirementAccount = findAccountListBeloveMinBalanceRequire(results_df)
  notifyTelegramAccount(belowBalanceRequirementAccount)
  
  print("Danh sách kết quả:", results_df)  # In ra danh sách kết quả để kiểm tra
  # Xuất kết quả ra tệp Excel mới
  try:
      results_df.to_excel(FILE_OUTPUT_URL, index=False)
      print("Kết quả đã được xuất ra tệp account_balances.xlsx")
  except Exception as e:
      print(f"Lỗi khi xuất tệp Excel: {e}")


schedule.every(60).seconds.do(main)
while 1:
  try:
    schedule.run_pending()
    time.sleep(1)
  except Exception as e:
    print(e)

