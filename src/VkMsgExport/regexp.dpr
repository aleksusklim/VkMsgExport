program regexp;
{$APPTYPE CONSOLE}
uses RegExpr, Classes, SysUtils;

var re:TRegExpr;
st:TFileStream;
pc,k:PChar;
i:Integer;
begin
if ParamCount<>2 then begin
Writeln('Usage: regexp.exe "expression" "file.txt"');
Halt(3);
end;
try
st:=TFileStream.Create(ParamStr(2),fmOpenRead or fmShareDenyNone);
GetMem(pc,st.size+1);
st.ReadBuffer(pc^,st.size);
k:=pc;
for i:=st.size downto 1 do begin
if ord(k^)<32 then k^:=' ';
Inc(k);
end;
k^:=#0;
st.Free();
re:=TRegExpr.Create();
re.ModifierM:=true;
re.ModifierR:=true;
re.ModifierI:=false;
re.Expression:=ParamStr(1);
if re.Exec(string(pc)) then begin
Writeln(re.Match[1]);
re.Free();
Halt(0);
end;
re.Free();
Halt(1);
except on e:Exception do begin
WriteLn(e.message);
Halt(2);
end;
end;
end.
