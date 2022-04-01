
<!--#echo json="package.json" key="name" underline="=" -->
ansible-bogus-linux-pwhash
==========================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
A linux password hash value (for the password field in /etc/passwd or
/etc/shadow) that is invalid (i.e. there is no correct input that could match
this hash) but can be used with ansible without fuss.
<!--/#echo -->


API
---

This module exports [one string](pwhash.json).



Why make a package for a static string?
---------------------------------------

* To have a place for the documentation, to describe the idea behind it.
* To have a place for distributing updates, in case it turns out later
  versions of ansible will have other criteria.
* To have an issue tracker.
* To have a place to run CI tests. (To be implemented; see open issues.)



The problem
-----------

I encountered a scenario where I want to configure a desktop user account
that can not be used to login interactively or via SSH.
(The login manager is configured to start a session for that user when
appropriate, without password prompt.)

Inside that session, `xscreensaver` shall be able to lock the screen, and
a custom event mechanism is set up to stop `xscreensaver` when appropriate.
Unfortunately, when no password was set, `xscreensaver` would exit on any
activity, with no password asked at all.
I want the opposite effect: It asks for a password but no possible input
can be correct.



Solution for Ubuntu
-------------------

So I attempted a fake SHA-512 password hash: `$6$fakesalt$bogus`
Any real password hash will be much longer, so there cannot be a password
whose hash is literally `bogus`.
This seems to work very well in Ubuntu, as expected.



Solution for Ubuntu and ansible
-------------------------------

However, when using ansible 2.9.9, the `user` task to update that hash
fails with

```text
[WARNING]: The input password appears not to have been hashed. The 'password' argument must be encrypted for this module to work properly.
```

when the hash is not exactly 86 characters long.
So how about we use 86 characters, but include some that are not in the
usual charset?

According [to wikipedia][wp-radix64],
the charset used by `crypt` (CLI frontend: `mkpasswd`) is
`.`, `/`, `0`-`9`, `A`-`Z`, `a`-`z`, with no padding.
Let's check:

```text
$ mkpasswd --method=sha-512 qux fakesalt | tr 0-9A-Za-z ' '
$ $        $                                  /             /     /             .        .       .
```

  [wp-radix64]: https://en.wikipedia.org/wiki/Base64?oldid=961105280#Radix-64_applications_not_compatible_with_Base64

Looks like WP is correct on that. Thus, no real password hash can contain `=`.
Also `=` is a good candidate for the first character of the hash, because a
hash based on the idea of Base64 probably won't use the Base64 padding
character in its data charset.




<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
