CREATE TABLE Kedvenc (
    termek_id INT NOT NULL,
    ar DECIMAL(10, 2) NOT NULL,
    keszlet INT NOT NULL,
    PRIMARY KEY (termek_id),
    FOREIGN KEY (termek_id) REFERENCES Termek(termek_id)
);