INSERT INTO cards (notes, user_id) VALUES ('react is developed by fb', 1);
INSERT INTO cards (notes, user_id) VALUES ('Typescript adds optional static typing to javascript', 1);

INSERT INTO tags (name) VALUES ('react');
INSERT INTO tags (name) VALUES ('js');
INSERT INTO tags (name) VALUES ('typescript');

INSERT INTO cards_tags (tag_id, card_id) VALUES (1, 1);
INSERT INTO cards_tags (tag_id, card_id) VALUES (2, 1);
INSERT INTO cards_tags (tag_id, card_id) VALUES (2, 2);
INSERT INTO cards_tags (tag_id, card_id) VALUES (3, 2);