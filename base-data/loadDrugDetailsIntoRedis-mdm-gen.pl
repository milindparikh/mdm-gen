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
my $productfile = "./Product.txt";
my $applicationfile = "./application.txt";


open (APPLICATIONFILE, $applicationfile) || die ("unable to open application file");
open (PRODUCTFILE, $productfile) || die ("unable to open product file");

$aLine = <APPLICATIONFILE>;
$pLine = <PRODUCTFILE>;

my %hshSponsor;

while ($aLine = <APPLICATIONFILE>) {
    chop $aLine;
    @dataElems = split('\t', $aLine);
    $dataElems[2] =~ s/\s+$//;
    $hshSponsor{$dataElems[0]} = $dataElems[2];
}

while ($pLine = <PRODUCTFILE>) {

    chop $pLine;
    @dataElems2 = split('\t', $pLine);
    
    $applicationNo = @dataElems2[0];
    $ProductNo = @dataElems2[1];
    $form = @dataElems2[2];
    $dosage = @dataElems2[3];
    $referenceDrug = @dataElems2[6];
    $drugName = @dataElems2[7];
    $activeIngredient = @dataElems2[8];
    $sponsorApplicant = $hshSponsor{$applicationNo}; 


    print "  rpush MDM_GEN:LIST:BASE:fda-drug \"".$applicationNo.$ProductNo."\"";
    print " \n";
    print " \n";


    print "  hset MDM_GEN:LOOKUP:BASE:fda-drug-drugname \"".$applicationNo.$ProductNo."\"      \"".$drugName."\"";
    print " \n";
    print " \n";

    
    print "  hset MDM_GEN:LOOKUP:BASE:fda-drug-sponsorApplicant \"".$applicationNo.$ProductNo."\"      \"".$sponsorApplicant."\"";
    print " \n";
    print " \n";

    print "  hset MDM_GEN:LOOKUP:BASE:fda-drug-form \"".$applicationNo.$ProductNo."\"      \"".$form."\"";
    print " \n";
    print " \n";

    print "  hset MDM_GEN:LOOKUP:BASE:fda-drug-dosage \"".$applicationNo.$ProductNo."\"      \"".$dosage."\"";
    print " \n";
    print " \n";

}

