#!/bin/sh
#
# Try to load each PHP file to see whether we get warnings or not
# (which is much faster than trying them online)
#
# There are 1688 PHP files, but many have content that we cannot load
# (i.e. inline content which would generate errors or output text)
# Therefore, we have the list of files to test and use a for loop to
# test only those we want to test.

#for f in `sed -e '/^#-/ d' test-files.txt`
for f in `cat test-files.txt`
do
    # a comment?
    if echo $f | grep -s '^#-' >/dev/null
    then
        # just ignore 100% in this case
        # (i.e. in most cases those are sample files)
        FILE=`echo $f | sed -e 's/^#-//'`
        echo "skipping $FILE"
        continue
    fi

    FILE=`echo $f | sed -e 's/^#//'`

    echo "testing $FILE ... \c"

    # if commented out, only check the syntax
    if echo $f | grep -s '^#' >/dev/null
    then
        php -l $FILE >/dev/null 2>test-output.log
    else
        # create a PHP file to include the test because we need to have the
        # sugarEntry defined
        echo "<?php" >test.php
        echo "define('sugarEntry', true);" >>test.php
        echo "require('$FILE');" >>test.php

        # "run the test" (there should be close to nothing to run)
        php -e test.php >/dev/null 2>test-output.log
    fi

    if test -s test-output.log
    then
        echo "failure."

        # output the error stream
        echo
        cat test-output.log
        echo
        exit 1;
    fi

    echo "success!"
done


# vim: ts=4 sw=4 et
