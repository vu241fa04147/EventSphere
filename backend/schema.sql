CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY users_email_unique (email)
);

CREATE TABLE IF NOT EXISTS events (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(80) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    time VARCHAR(40) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    event_id BIGINT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('confirmed', 'cancelled') NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY bookings_user_id_idx (user_id),
    KEY bookings_event_id_idx (event_id),
    CONSTRAINT bookings_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT bookings_event_fk FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
);
