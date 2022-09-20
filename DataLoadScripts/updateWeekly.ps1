Write-Host (get-date).ToString() " :: Starting WEEKLY run script"

###
# Process the JSON to SQL 
###
Write-Host (get-date).ToString() " :: Starting process of Json to Sql"
$p = Start-Process java -ArgumentList ' -Xmx8G -jar MtgJsonToMssql-1.0-SNAPSHOT.jar sets' -Wait -PassThru -NoNewWindow
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
$p = Start-Process java -ArgumentList '-jar MtgSqlRunner-1.0-SNAPSHOT.jar diff.sql local' -Wait -PassThru -NoNewWindow
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
$p = Start-Process java -ArgumentList '-jar MtgSqlRunner-1.0-SNAPSHOT.jar diff.sql live' -Wait -PassThru -NoNewWindow
if($p.ExitCode -ne 0)
{
    Write-Host (get-date).ToString() " :: Error Processing SQL COMMANDS against live"
    exit $p.ExitCode
}
Write-Host (get-date).ToString() " :: Finished process of Running Sql against live"

###
# Process the Downloads List
###
Write-Host (get-date).ToString() " :: Starting process of downloading images"
$p = Start-Process java -ArgumentList '-jar MtgDownlodImages-1.0-SNAPSHOT.jar' -Wait -PassThru -NoNewWindow
if($p.ExitCode -ne 0)
{
    Write-Host (get-date).ToString() " :: Error Processing Image Downloads"
    exit $p.ExitCode
}


###
# Upload the downloads
###
$env:AZCOPY_CRED_TYPE = "Anonymous";

Write-Host (get-date).ToString() " :: Starting process of Uploading Set Icons"
./azcopy.exe copy "E:\src\MtgDiscoveryPipeline\downloads\setIcons\" "<AUTH>" --overwrite=true --from-to=LocalBlob --blob-type Detect --follow-symlinks --put-md5 --follow-symlinks --recursive;
if($LASTEXITCODE -ne 0)
{
    Write-Host (get-date).ToString() " :: Error Uploading Set Icons"
    exit $LASTEXITCODE
}
Write-Host (get-date).ToString() " :: Finished process of Uploading Set Icons"

Write-Host (get-date).ToString() " :: Starting process of Uploading Card Images"
./azcopy.exe copy "E:\src\MtgDiscoveryPipeline\downloads\cards\" "<ATUH>" --overwrite=false --from-to=LocalBlob --blob-type Detect --follow-symlinks --put-md5 --follow-symlinks --recursive;
if($LASTEXITCODE -ne 0)
{
    Write-Host (get-date).ToString() " :: Error Uploading Card Images"
    exit $LASTEXITCODE
}

$env:AZCOPY_CRED_TYPE = "";
Write-Host (get-date).ToString() " :: Finished process of Uploading Card Images"

Write-Host (get-date).ToString() " :: All Done!"