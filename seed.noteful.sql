TRUNCATE folders, notes RESTART IDENTITY;

INSERT INTO folders
  (folder_name)
  VALUES 
  ('Psych'),
  ('Monk'),
  ('Avatar: The Last Airbender'),
  ('Dexter'),
  ('Game of Thrones');

INSERT INTO notes
  (folder, name, content)
  VALUES
  (1, 'Shawn', 'Shawn is a snarky "Psychic" detective' ),
  (2, 'Adrian Monk', 'Monk is the OCD wrought hero of the series'),
  (3, 'Aang', 'Aang is dicovered in an iceberg and soon descovers he is the last of his kind, and must save the world'),
  (4, 'Dexter Morgan', 'Dexter is the hero of the story, if you consider people who murder bad people to be heroes anyway'),
  (5, 'John Snow', 'John Snow is a bastard of a noble family, or so he thinks until the penultimate season when things go south'); 

  --psql -U dunder_mifflin -d noteful -f "C:\Users\Nick\Desktop\nodeProjects\noteful-api\sql-scripts\seed.noteful.sql"