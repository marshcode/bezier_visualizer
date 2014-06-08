

#PUBLIC COMMANDS

start-server:_cmd_start-server _cmd_open-dir_cmd
	 
stop-server:_cmd_stop-server

#COMMAND SECTION:
#these are generic commands to be used
_cmd_start-server: 
	@python -m SimpleHTTPServer 9090&
	
#sketchy - I'm simply killing the process on port 9090. If it becomes a problem, we make python write a pid first
_cmd_stop-server:
	@fuser -k 9090/tcp
	
_cmd_open-dir_cmd:
	@sensible-browser localhost:9090