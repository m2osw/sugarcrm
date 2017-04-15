
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
still happen, but it looks like it should be pretty good. This change
involved (a few times) the renaming of some functions. This means I may
have missed changing the name of the function from callers... that means
it still won't work as expected.

As far as I'm concerned, I finish worked on the installation and it works
as expected in "Custom" mode. I do not know about the other mode(s) as
I'm not using them. The only quirk is the SugarCRM registration page which
has a permission error, like I care.

Once installed, I get to the Dashboard as expected.

That's it for now.

I will be working on the other pages, adding contacts, managing contacts,
calendar, etc. It's a huge project so it make take some time before we
have a version that is seemless.

Note that at this point, if you are not a programmer, you may still find
it rather difficult to install and use.

# Help Wanted

If you are a programmer and want to help, I'll be happy to give you access.
I still don't understand (or maybe I missed it?) why there wasn't yet a
fork of SugarCRM that works in PHP 7.

