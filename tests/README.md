Start of a benchmark test... at the moment this is more of an integration test!

```
# Create 4 users
/usr/local/bin/casperjs test simple.js --me=unittest_1
/usr/local/bin/casperjs test simple.js --me=unittest_2
/usr/local/bin/casperjs test simple.js --me=unittest_3
/usr/local/bin/casperjs test simple.js --me=unittest_4

# Test sending yos
/usr/local/bin/casperjs test simple.js --me=unittest_1 --friends=unittest_2,unittest_3,unittest_4
/usr/local/bin/casperjs test simple.js --me=unittest_2 --friends=unittest_1,unittest_3,unittest_4
/usr/local/bin/casperjs test simple.js --me=unittest_3 --friends=unittest_1,unittest_2,unittest_4
/usr/local/bin/casperjs test simple.js --me=unittest_4 --friends=unittest_1,unittest_2,unittest_3
```