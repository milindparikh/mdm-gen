#!/usr/bin/perl
my $zipfile = "./us_postal_codes.csv";

open (ZIPFILE, $zipfile) || die ("Unable to open file ");
$aLine = <ZIPFILE>;

$cnt = 1;

%hshStates;


while ($aLine = <ZIPFILE>) {
    chop $aLine;

    @dataElems = split (',', $aLine);

 
    $dataElems[2] =~ s/\s//g;
    
	$hshStates{$dataElems[2]} = 1;

	print "  rpush MDM_GEN:LIST:BASE:us-zipcode \"".$dataElems[0]."\"";
	print " \n";
	print " \n";
	

	print "  hset MDM_GEN:LOOKUP:BASE:us-zipcode-state \"".$dataElems[0]."\"      \"".$dataElems[2]."\"";
	print " \n";
	print " \n";
	
	print "  hset MDM_GEN:LOOKUP:BASE:us-zipcode-city \"".$dataElems[0]."\"      \"".$dataElems[1]."\"";
	print " \n";
	print " \n";
	
    print "  rpush MDM_GEN:LIST:BASE:us-state-zipcode:".$dataElems[2]."    \"".$dataElems[0]."\"";
	

 	print " \n";
	print " \n";
 
    
}
    
my @states = keys(%hshStates) ;

for my $state (@states) {
    if ( length ($state) > 2) {
	print "  rpush MDM_GEN:LIST:BASE:us-state \"".$state."\"";
	print " \n";
	print " \n";
    }
}

