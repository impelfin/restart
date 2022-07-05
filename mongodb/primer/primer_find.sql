use test
db.primer.find({borough:"Queens"}).sort({address:1}).pretty()

db.primer.find({borough:"Queens"}).sort({address:-1}).pretty()


db.primer.find({"address.zipcode":"11356"},{grades:{$elemMatch:{grade:"A"}}})
