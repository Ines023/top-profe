CREATE TABLE `professor` (
	`id` mediumint(9) NOT NULL AUTO_INCREMENT,
	`name` char(50) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `name` (`name`)
);
CREATE TABLE `subject` (
	`acronym` char(4) NOT NULL,
	`name` char(50) NOT NULL,
	PRIMARY KEY (`acronym`)
);
CREATE TABLE `review` (
	`prof_id` mediumint(9) NOT NULL,
	`subj_acr` char(4) NOT NULL,
	`stars` tinyint(4) NOT NULL,
	`reviewer` char(64) NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`prof_id`,`subj_acr`,`reviewer`)
);
CREATE TABLE `teaching` (
	`prof_id` mediumint(9) NOT NULL,
	`subj_acr` char(4) NOT NULL
);