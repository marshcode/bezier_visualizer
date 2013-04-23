#!/usr/bin/python
import time
import BaseHTTPServer
import SimpleHTTPServer
import os
import fnmatch
import sys
 
HOST_NAME = '' # !!!REMEMBER TO CHANGE THIS!!!
PORT_NUMBER = 8080 # Maybe set this to 9000.

FILE_DIR = os.path.dirname( os.path.abspath(__file__) )
 
 
class MyHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
   
 
    the_arg = None
 
    qunit_html_template = """
<html>
    <head>
      <meta charset="utf-8">
      <title>QUnit Automated Test Runner</title>
      <link rel="stylesheet" href="/qunit/qunit.css">
      
      <!-- Source Includes -->
      <script src="/js/core/bezier.js"></script>
      <script src="/js/widgets/visualizers.js"></script>
      <!-- Qunit -->
      <script src="/qunit/qunit.js"></script>
      <script src="/qunit/qunit_utils.js"></script>
      
      <!-- Test Includes -->
      {scripts}
      
    </head>
    <body>
      <div id="qunit"></div>
      <div id="qunit-fixture"></div>
    
    </body>
</html>
    
    """
 
 
   
    def serve_path_file(self, path, mime_type):
        self.send_response(200)
        self.send_header("Content-type", mime_type)
        self.end_headers()
       
        with file(path) as f:
            self.wfile.write(f.read())

   
    def serve_test(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        test_pattern = "test*.js"

        tests = []

        #a hack but whatever
        one_file = False
        if self.the_arg is not None:
            the_file = self.the_arg
            one_file = os.path.isfile(the_file)
            one_file = one_file and fnmatch.fnmatch(os.path.basename(the_file), test_pattern)
            
        if one_file:
            tests.append( the_file )
        else:
            for dirpath, dirnames, filenames in os.walk(self.the_arg):
    
                for fname in fnmatch.filter(filenames, test_pattern):
                    tests.append(os.path.join(dirpath, fname))

        tests = ["""<script src="{}"></script>""".format(script.replace(os.getcwd(), "")) 
                 for script in tests]

        self.wfile.write( self.qunit_html_template.format(scripts = "\n".join(tests)) )

 
    def do_GET(self):
        """Respond to a GET request."""
       
        if self.path.startswith("/run_tests"):
            self.serve_test()
        elif self.path.startswith("/qunit/qunit.js"):
            self.serve_path_file(os.path.join(FILE_DIR, "qunit.js"), "text/javascript")
        elif self.path.startswith("/qunit/qunit.css"):
            self.serve_path_file(os.path.join(FILE_DIR, "qunit.css"), "text/css")
        elif self.path.startswith("/qunit/qunit_utils.js"):
            self.serve_path_file(os.path.join(FILE_DIR, "qunit_utils.js"), "text/javascript")
        
        else:
            SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)
 
 
 
if __name__ == '__main__':
    if len(sys.argv) >=2 and os.path.exists(sys.argv[1]):
        MyHandler.the_arg = sys.argv[1]
    else:
        import sys
        print "must call with file/directory as first argument"
        sys.exit(-1)
    
    
    httpd = BaseHTTPServer.HTTPServer((HOST_NAME, PORT_NUMBER), MyHandler)
    print time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER)