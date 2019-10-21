@echo off

set use_wget=1
set use_curl=0

cd /d %~dp0
cd ..
set mess=messages
mkdir "%mess%" 1>nul 2>nul
cd %mess%
set request=..\VkMsgExport
set fetch=0
set method=messages.getHistory
if "%~1" == "NONE" (
set fetch=1
set method=execute
)
if "%~1" == "*" (
set fetch=2
set file=..\users.txt
set method=execute
)
set dialog=%~1
set tmptmp=tmp.tmp
set zipname=..\messages.zip
set remixsid=..\remixsid.txt
set ext=txt
set min=180
set dev=https://vk.com/dev
del /f /q %tmptmp% 1>nul 2>nul
set token=NONE
(
set /p cookie=<%remixsid%
) 1>nul 2>nul
if "%cookie%" == "" goto :nocookie
echo Init...
call :httpg "%dev%/%method%"  %tmptmp% "Cookie: remixsid=%cookie%;"
for /f "usebackq" %%i IN (`%request%\regexp.exe "Dev\.methodRun\('([^']+)" %tmptmp%`) do set token=%%i
del /f /q %tmptmp% 1>nul 2>nul
if "%token%" == "NONE" goto :nocookie
if "%token%" == "" goto :nocookie
if "%fetch%" == "0" goto :dlg
if "%fetch%" == "1" goto :base
:test
echo Users:
mkdir "idu" 1>nul 2>nul
del /q /f ".\idu\*.txt" 1>nul 2>nul
set num=0
for /f "tokens=1 delims=;" %%i in (%file%) do call :next %%i
call :final & echo DONE! & pause & exit
:next
if "%1" == "*" goto :eof
if "%1" == "" goto :eof
echo ...
set arr=%*
set chr=%arr:~,1%
if "%chr%" == "" goto :eof
set minus=0
if "%chr%" == "-" set minus=1
set arr=%arr:-=%
set Q=^%%^%%22
set P=^%%^%%2B
call :http "%dev%" %tmptmp% "Cookie: remixsid=%cookie%;" "act=a_run_method&al=1&hash=%token%&method=%method%&param_code=var a;a=[%arr%];if(%minus%){return {items:API.groups.getById({group_ids:a,v:5.60})};}else{return {items:API.users.get({user_ids:a,fields:%Q%screen_name%Q%,v:5.60})};};"
move /y %tmptmp% ".\idu\%num%.txt"
set /a num=%num%+1
goto :eof
:base
set count=50
set num=0
mkdir "ids" 1>nul 2>nul
echo ids
:all
set /a offset=%num%*%count%
set Q=^%%^%%22
set P=^%%^%%2B
call :http "%dev%" %tmptmp% "Cookie: remixsid=%cookie%;" "act=a_run_method&al=1&hash=%token%&method=%method%&param_code=var m,i,u,g,n;m=API.messages.getDialogs({count:%count%,offset:%offset%,preview_length:1,v:5.60}).items;i=m.length;g=%Q%%Q%;n=%Q%%Q%;while(i>0){i=i-1;u=m[i].user_id;if(!m[i].chat_id){if(u>1000000000){g=g%P%%Q%,%Q%%P%(u-1000000000);}else{n=n%P%%Q%,%Q%%P%u;}}}if(g!=%Q%%Q%){g=API.groups.getById({group_ids:g.substr(1,g.length),v:5.60});}else{g=[];}if(n!=%Q%%Q%){n=API.users.get({user_ids:n.substr(1,n.length),fields:%Q%screen_name%Q%,v:5.60});}else{n=[];}return {items:[m,n,g]};"
call :getfilesize %tmptmp%
if %size% lss %min% echo Zipping... & call :final & echo DONE! & pause & exit
echo %offset%
del /f /q "ids\%num%.%ext%" 1>nul 2>nul
move %tmptmp% "ids\%num%.%ext%"
set /a num=%num%+1
goto :all
:dlg
set count=100
echo id_%dialog%
set num=0
set new=0
:seek
if not exist "id_%dialog%\%new%.%ext%" goto :loop
set num=%new%
set /a new=%new%+1
goto :seek
:loop
set /a offset=%num%*%count%
echo %offset%
call :download
if "%wrong%" == "1" goto :end
if "%num%" == "0" mkdir "id_%dialog%" 1>nul 2>nul
del /f /q "id_%dialog%\%num%.%ext%" 1>nul 2>nul
move %tmptmp% "id_%dialog%\%num%.%ext%"
set /a num=%num%+1
goto :loop
:end
shift
set dialog=%~1
if "%~1" == "" call :final & echo DONE! & pause & exit
goto :dlg
:download
call :http "%dev%" %tmptmp% "Cookie: remixsid=%cookie%;" "act=a_run_method&al=1&hash=%token%&method=%method%&param_count=%count%&param_offset=%offset%&param_user_id=%dialog%&param_rev=1&param_v=5.60" 
call :getfilesize %tmptmp%
set wrong=0
if %size% lss %min% (
set wrong=1
del /f /q %tmptmp% 1>nul 2>nul
)
goto :eof
:getfilesize
set size=%~z1
goto :eof
:nocookie
echo.>%remixsid%
echo (function(i){i=document.cookie.match('remixsid=(.*?);');if(!i)alert('ERROR');else prompt('Copy this to remixsid.txt',i[1]);})();>>%remixsid%
echo.>>%remixsid%
echo /*>>%remixsid%
echo Execute that in browser's console, somewhere at vk.com; or >>%remixsid%
echo put the following line to URL address bar and go: >>%remixsid%
echo.>>%remixsid%
echo javascript:(function(i){i=document.cookie.match('remixsid=(.*?);');if(!i)alert('ERROR');else prompt('Copy this to remixsid.txt',i[1]);})();>>%remixsid%
echo.>>%remixsid%
echo */>>%remixsid%
call :final & echo Wrong remixsid.txt! & pause & exit
:http
set post=1
goto :httpp
:httpg
set post=0
:httpp
rem :http "get_url" "save_to" "cookie_header" "post_data"
if "%use_wget%%use_curl%" == "11" echo Use wget OR curl! & pause & exit
if "%use_wget%" == "1" goto :http_wget
if "%use_curl%" == "1" goto :http_curl
echo Use WGET or CURL! & pause & exit
:http_wget
set language=english
if "%post%" == "1" goto :http_wgetp
%request%\wget.exe -q --no-check-certificate -O %2 --header %3 %1 1>nul 2>nul
:http_wgetp
%request%\wget.exe -q --no-check-certificate -O %2 --header %3 --post-data %4 %1 1>nul 2>nul
goto :eof
:http_curl
if "%post%" == "1" goto :http_curlp
%request%\curl.exe -s -k -L -c jar.tmp -H %3 %1 >%2
del /f /q jar.tmp 1>nul 2>nul
goto :eof
:http_curlp
%request%\curl.exe -s -k -L -c jar.tmp -H %3 -d %4 %1 >%2
del /f /q jar.tmp 1>nul 2>nul
goto :eof
:http_browse
start "" %browser% "%~f1"
goto :eof
:final
set zipmask=\*.txt
set tozip=ids%zipmask% idu%zipmask%
del /f /q %zipname% 1>nul 2>nul
for /D %%i in (id_*) do call :zip %%i
%request%\zip.exe -1 -q %zipname% %tozip% 1>nul 2>nul
del /f /q %tmptmp% 1>nul 2>nul
goto :eof
:zip
set tozip=%tozip% %1%zipmask%
goto :eof
