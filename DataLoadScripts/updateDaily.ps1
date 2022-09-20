Write-Host (get-date).ToString() " :: Starting DAILY run script"

###
# Process the JSON to SQL 
###
Write-Host (get-date).ToString() " :: Starting process of Json to Sql"
$p = Start-Process java -ArgumentList '-jar MtgJsonToMssql-1.0-SNAPSHOT.jar prices' -Wait -PassThru -NoNewWindow
if($p.ExitCode -ne 0)
{
    Write-Host (get-date).ToString() " :: Error Processing JSON to SQL"
    exit $p.ExitCode
}
Write-Host (get-date).ToString() " :: Finshed process of Json to Sql"


###
# Execute the Generated Sql against local
###
Write-Host (get-date).ToString() " :: Starting process of Running Sql against local"
$p = Start-Process java -ArgumentList '-jar MtgSqlRunner-1.0-SNAPSHOT.jar prices.sql local' -Wait -PassThru -NoNewWindow
if($p.ExitCode -ne 0)
{
    Write-Host (get-date).ToString() " :: Error Processing SQL COMMANDS against local"
    exit $p.ExitCode
}
Write-Host (get-date).ToString() " :: Finished process of Running Sql against local"

###
# Execute the Generated Sql against live
###
Write-Host (get-date).ToString() " :: Starting process of Running Sql against live"
$p = Start-Process java -ArgumentList '-jar MtgSqlRunner-1.0-SNAPSHOT.jar prices.sql live' -Wait -PassThru -NoNewWindow
if($p.ExitCode -ne 0)
{
    Write-Host (get-date).ToString() " :: Error Processing SQL COMMANDS against live"
    exit $p.ExitCode
}
Write-Host (get-date).ToString() " :: Finished process of Running Sql against live"