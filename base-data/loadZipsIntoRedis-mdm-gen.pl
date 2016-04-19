#!/usr/bin/perl
my $zipfile = "./zipCodes.txt";

open (ZIPFILE, $zipfile) || die ("Unable to open file ");
$aLine = <ZIPFILE>;

$cnt = 1;

while ($aLine = <ZIPFILE>) {
    chop $aLine;
    if ($aLine =~ /\d{5}/) {
	print "  rpush MDM_GEN:LIST:BASE:us-zipcode ".$aLine;
	print "\n";
	print "\n";
	
    }
    else {
	    
    }
    
    
}
    

