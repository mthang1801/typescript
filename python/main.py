import MetaTrader5 as mt5

# Your MetaTrader account credentials
account_id = 107416182
password = 'Chipcoi@89'
server = 'Exness-MT5Real6'  # e.g., 'MetaQuotes-Demo'
path="C:/Program Files/MetaTrader 5/terminal64.exe"


# Initialize MetaTrader 5
if not mt5.initialize():
  print("initialize() failed", mt5.last_error())
  mt5.shutdown()

# Login to the account
if not mt5.login(account_id, password=password, server=server):
  print("login() failed", mt5.last_error())
  mt5.shutdown()

# Get account information
account_info = mt5.account_info()
if account_info is None:
    print("Failed to get account information")
else:
    print("Account Balance:", account_info.balance)

# Shutdown connection to MetaTrader 5
mt5.shutdown()

