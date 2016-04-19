#!/usr/bin/perl
my $zipfile = "./us_postal_codes.csv";

open (ZIPFILE, $zipfile) || die ("Unable to open file ");
$aLine = <ZIPFILE>;

$cnt = 1;

while ($aLine = <ZIPFILE>) {
    chop $aLine;

    @dataElems = split (',', $aLine);

    print "  hset MDM_GEN:LOOKUP:BASE:us-zipcode-city \"".$dataElems[0]."\"      \"".$dataElems[1]."\"";
    print " \n";
    print " \n";

    
    print "  hset MDM_GEN:LOOKUP:BASE:us-zipcode-state \"".$dataElems[0]."\"      \"".$dataElems[2]."\"";
    print " \n";
    print " \n";


    print "  hset MDM_GEN:LOOKUP:BASE:us-zipcode-county \"".$dataElems[0]."\"      \"".$dataElems[4]."\"";
    print " \n";
    print " \n";

    print "  hset MDM_GEN:LOOKUP:BASE:us-zipcode-lat \"".$dataElems[0]."\"      \"".$dataElems[5]."\"";
    print " \n";
    print " \n";

    print "  hset MDM_GEN:LOOKUP:BASE:us-zipcode-long \"".$dataElems[0]."\"      \"".$dataElems[6]."\"";
    print " \n";
    print " \n";

    
    
}
    

