@echo off
cd /d %~dp0
set file=users.txt
if not exist %file% cd .>%file%
set proc=0
set res=NONE
FOR /f "tokens=1 delims=;" %%i in (%file%) do call :next %%i
call VkMsgExport\core.bat %res%
pause
exit
:next
if "%proc%" == "1" goto :eof
set proc=1
set res=%*
goto :eof
