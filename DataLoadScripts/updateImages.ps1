Write-Host (get-date).ToString() " :: Starting WEEKLY run script"


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

Write-Host (get-date).ToString() " :: All Done!"