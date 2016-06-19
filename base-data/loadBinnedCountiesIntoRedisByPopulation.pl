#
# Copyright [2016] [Milind Parikh]
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#    http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#See the License for the specific language governing permissions and
# limitations under the License.

#!/usr/bin/perl
my $newfile = "./USCountiesByPopulation.csv";

my %hshKV;
$totalCnt = 0;
$totalBins = 15000;
$startBin = 0;

open (NEWFILE, $newfile) || die "unable to open new file";


while ($aLine = <NEWFILE>) {

    @dataElems = split ('\t', $aLine);

    if ($dataElems[2] =~ /Alaska/) {
    }
    else {
	if ($dataElems[2] =~ /Louisiana/) {
	}
	else{
	    $dataElems[1] =~ s/County(\[\d*\])*//g;
	    $dataElems[1] =~ s/\,.*//;
	    $dataElems[1] =~ s/-//;
	    $dataElems[1] =~ s/\s+$//;
	    $dataElems[1] =~ s/\[\d*\]//;
	    $dataElems[1] =~ s/\s//g;
	    
	    $dataElems[2] =~ s/\s+$//;
	    $dataElems[2] =~ s/\w+\s+of(\[\d*\]-)//g;
	    $dataElems[2] =~ s/\s//g;
	    $dataElems[2] =~ s/\'//;
	    
	    $dataElems[3] =~ s/,//g;

	    $hshKV{$dataElems[1].'-'.$dataElems[2]} = $dataElems[3];
	    $totalCnt = $totalCnt+$dataElems[3];

	}
    }
}


for (keys %hshKV) {

    $consumedBins =  int(($hshKV{$_} / $totalCnt)*$totalBins);
    if ($consumedBins == 0) {
	$consumedBins = 1;
    }

    for ($cnt = 0; $cnt < $consumedBins; $cnt++) {
	$startBin = $startBin + 1;

	print "  hset MDM_GEN:LOOKUP:BASE:binned-us-counties-by-population \"".$startBin."\"      \"".$_."\"";

	print " \n";
	print " \n";

    }
}
