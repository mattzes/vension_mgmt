Table item {
id integer [primary key]
meat_type_id integer
animal_type_id integer
freezer_id integer
drawer_number integer
weight integer
date datetime
count integer
locked boolean
reserved_for varchar
}

Table freezer {
id integer [primary key]
name varchar
drawer_count integer
}

Table animal_type {
id integer [primary key]
name varchar
}

Table meat_type {
id integer [primary key]
name varchar
}

Table pricing {
id integer [primary key]
meat_type_id integer
animal_type_id integer
price float
}

Ref: item.meat_type_id > meat_type.id

Ref: item.animal_type_id > animal_type.id

Ref: pricing.meat_type_id > meat_type.id

Ref: pricing.animal_type_id > animal_type.id

Ref: item.freezer_id > freezer.id
