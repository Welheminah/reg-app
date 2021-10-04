create table the_towns(
    id serial not null primary key,
    town text not null,
    reg_mark text not null
);

create table the_reg_numbers(
    id serial not null primary key,
    reg_no text not null,
    towns_id int,
    foreign key (towns_id) references the_towns(id)
);
INSERT INTO the_towns(town, reg_mark) VALUES ('Cape Town', 'CA');
INSERT INTO the_towns(town, reg_mark) VALUES ('Paarl', 'CJ');
INSERT INTO the_towns(town, reg_mark) VALUES ('Stellenbosch', 'CL');
