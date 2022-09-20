Write-Host (get-date).ToString() " :: Starting MONTHLY run script"

###
# Remove Folder
###
Remove-Item 'E:\src\MtgDiscoveryPipeline\downloads' -Recurse

###
# Process the JSON to SQL 
###
Write-Host (get-date).ToString() " :: Starting process of creating image lists"
$p = Start-Process java -ArgumentList '-jar MtgJsonToMssql-1.0-SNAPSHOT.jar images' -Wait -PassThru -NoNewWindow
if($p.ExitCode -ne 0)
{
    Write-Host (get-date).ToString() " :: Error Processing creating image lists"
    exit $p.ExitCode
}
Write-Host (get-date).ToString() " :: Finshed process of creating image lists"


###
# Process the Downloads List
###
Write-Host (get-date).ToString() " :: Starting process of downloading images"
$p = Start-Process java -ArgumentList '-jar MtgDownlodImages-1.0-SNAPSHOT.jar replaceAll' -Wait -PassThru -NoNewWindow
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
./azcopy.exe copy "E:\src\MtgDiscoveryPipeline\downloads\cards\" "<AUTH>" --overwrite=true --from-to=LocalBlob --blob-type Detect --follow-symlinks --put-md5 --follow-symlinks --recursive;
if($LASTEXITCODE -ne 0)
{
    Write-Host (get-date).ToString() " :: Error Uploading Card Images"
    exit $LASTEXITCODE
}

$env:AZCOPY_CRED_TYPE = "";
Write-Host (get-date).ToString() " :: Finished process of Uploading Card Images"

Write-Host (get-date).ToString() " :: All Done!"
