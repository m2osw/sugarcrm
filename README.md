
# WARNING

I'm not working on this project anymore.

It has at least one security issue with the phpunit, which requires version
3.7.\*. That includes an issue with an `eval()` which gives attackers a
way to execute arbitrary code on your server.

You need at least version 4.8.28 of phpunit to be safe. A distribution
includes all the code, so it is likely that it would get included, although
I'm not too sure how phpunit gets used. You may still be safe.

# SugarCRM CE 6.5.x

This source is a fork of SugarCRM CE 6.5.x that works (mostly) with PHP 7
and MySQL 14.14 on Ubuntu 16.04.

It looks like the Sugar people do not want to make such drastic changes
to their codebase. Rather sad, it took me half a day to make it work. I'm
hardly done, but I do get the Dashboard and it looks pretty good already.

Btw, even the commercial version (SugarCRM 7.x) is not working on PHP 7.
Ouch!

# Changes

The only changes I want to do are of three categories:

1. Make it work with PHP 7. Some functions are obsolete and need replacement.
2. Beautify the code (i.e. only use spaces for indentation, clean consistent
   indentation throughout the project, that won't be done any time soon, there
   are over 1,600 PHP files!)
3. Fix any potential bugs I can find along the way (I already fixed quite a
   few...)

# Status

I ran PHP directly in my console against all the classes and that tells me
when there is a problem. I fixed many more functions that did not have
the correct signature between base classes and derived classes. These may
still happen, but it looks like it should be quite rare now. This change
involved (a few times) the renaming of some functions. This means I may
have missed changing the name of the function from callers... in other words,
it could be that it still won't work as expected!

As far as I'm concerned, I finished work on the installation and it works
as expected in "Custom" mode and MySQL. I do not know about the other
mode(s) as I'm not using them. The only quirk is the SugarCRM registration
page which has a permission error, like I care.

Once installed, I get to the Dashboard as expected and can create/manage
leads without problems. That included adding fields or options in a
dropdown in the Admin/Studio area.

I still have one issue which happens because some AJAX call does not
want to include the proper JavaScript in some situations. I still need
to understand which functions do not get called in those cases. You
can see the issue details here:

https://github.com/m2osw/sugarcrm/issues/1

# Control Project

If you are a programmer and want to take over, I'll be happy to give you
access.

