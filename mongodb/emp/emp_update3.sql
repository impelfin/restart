use test

db.emp.find({}, {_id:0, eno:1, ename:1, sal:1})

db.emp.update(
	{sal:{$gte:3350}},
	{$inc: {sal:1500}},
	{multi:true}
)

db.emp.find({}, {_id:0, eno:1, ename:1, sal:1})
