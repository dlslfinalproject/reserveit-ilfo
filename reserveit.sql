-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2025 at 06:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `reserveit`
--

-- --------------------------------------------------------

--
-- Table structure for table `tblactivities`
--

CREATE TABLE `tblactivities` (
  `activity_id` int(11) NOT NULL,
  `activity_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblactivities`
--

INSERT INTO `tblactivities` (`activity_id`, `activity_name`) VALUES
(1, 'Assembly'),
(2, 'Lasallian Formation'),
(3, 'Masterclass'),
(4, 'Meeting'),
(12, 'Others: Please specify:'),
(5, 'Outreach Program'),
(6, 'PE Class'),
(7, 'Recollection'),
(8, 'Seminar'),
(9, 'Spiritual Formation'),
(10, 'Team Building'),
(11, 'Training');

-- --------------------------------------------------------

--
-- Table structure for table `tblapproval_status`
--

CREATE TABLE `tblapproval_status` (
  `status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblapproval_status`
--

INSERT INTO `tblapproval_status` (`status_id`, `status_name`) VALUES
(2, 'Approved'),
(1, 'Pending'),
(3, 'Rejected');

-- --------------------------------------------------------

--
-- Table structure for table `tblrejection_reasons`
--

CREATE TABLE `tblrejection_reasons` (
  `reason_id` int(11) NOT NULL,
  `reason_description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblrejection_reasons`
--

INSERT INTO `tblrejection_reasons` (`reason_id`, `reason_description`) VALUES
(2, 'Conflict with Nature of Activity'),
(5, 'Incomplete Reservation Details'),
(4, 'Invalid Date and/or Time'),
(1, 'No Approved POA'),
(3, 'Unavailable Date'),
(6, 'Unavailable Venues');

-- --------------------------------------------------------

--
-- Table structure for table `tblreservations`
--

CREATE TABLE `tblreservations` (
  `reservation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `activity_id` int(11) DEFAULT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `reservation_startdate` date NOT NULL,
  `reservation_enddate` date NOT NULL,
  `number_of_participants` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status_id` int(11) NOT NULL DEFAULT 1,
  `rejection_reason_id` int(11) DEFAULT NULL,
  `rejection_other_notes` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `link_to_csao_approved_poa` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `custom_activity_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblreservations`
--

INSERT INTO `tblreservations` (`reservation_id`, `user_id`, `event_name`, `activity_id`, `venue_id`, `reservation_startdate`, `reservation_enddate`, `number_of_participants`, `start_time`, `end_time`, `status_id`, `rejection_reason_id`, `rejection_other_notes`, `notes`, `admin_notes`, `link_to_csao_approved_poa`, `created_at`, `updated_at`, `custom_activity_name`) VALUES
(12, 9, 'Taize Prayer', 11, NULL, '2025-06-05', '2025-06-05', 15, '15:15:00', '16:00:00', 3, NULL, NULL, '', NULL, '', '2025-06-02 02:53:01', '2025-06-03 02:05:25', NULL),
(13, 9, 'Birthday', 10, 5, '2025-06-12', '2025-06-12', 15, '15:15:00', '16:15:00', 2, NULL, NULL, '', '', '', '2025-06-02 03:23:31', '2025-06-03 11:22:51', NULL),
(17, 10, 'Taize Prayer', 11, NULL, '2025-06-18', '2025-06-18', 15, '07:00:00', '12:00:00', 2, NULL, NULL, '', NULL, '', '2025-06-03 01:17:19', '2025-06-03 08:25:19', NULL),
(18, 10, 'JPCS NITE', 8, NULL, '2025-06-09', '2025-06-09', 16, '07:00:00', '12:00:00', 2, NULL, NULL, '', NULL, '', '2025-06-03 01:26:35', '2025-06-03 01:36:11', NULL),
(21, 1, 'Master Class', 8, NULL, '2025-06-06', '2025-06-06', 96, '12:00:00', '17:00:00', 2, NULL, NULL, '', NULL, '', '2025-06-03 06:31:44', '2025-06-03 07:44:54', NULL),
(22, 1, 'Taize Prayer', 11, NULL, '2025-07-01', '2025-07-01', 99, '12:00:00', '15:00:00', 3, 5, '', '', NULL, '', '2025-06-03 07:53:48', '2025-06-03 08:19:44', NULL),
(23, 1, 'Taize Prayer', 9, NULL, '2025-06-07', '2025-06-07', 99, '12:00:00', '16:00:00', 2, NULL, NULL, '', NULL, '', '2025-06-03 08:33:18', '2025-06-03 08:39:47', NULL),
(24, 1, 'JPCS NITE', 5, 2, '2025-06-10', '2025-06-10', 15, '16:20:00', '17:00:00', 2, NULL, NULL, 'sadja', '', '', '2025-06-03 10:03:07', '2025-06-03 11:21:54', NULL),
(30, 10, 'Taize Prayer', 10, NULL, '2025-06-09', '2025-06-09', 20, '12:00:00', '13:00:00', 1, NULL, NULL, '', NULL, '', '2025-06-03 13:23:41', '2025-06-03 13:23:41', NULL),
(31, 10, 'Birthday', 8, NULL, '2025-06-09', '2025-06-09', 43, '12:00:00', '13:00:00', 1, NULL, NULL, '', NULL, '', '2025-06-03 13:24:30', '2025-06-03 13:24:30', NULL),
(32, 1, 'Taize Prayer', 9, 2, '2025-06-25', '2025-06-25', 20, '16:00:00', '17:00:00', 2, NULL, NULL, '', '', '', '2025-06-03 13:30:13', '2025-06-03 15:25:31', NULL),
(33, 1, 'Taize Prayer', 9, 2, '2025-06-25', '2025-06-25', 20, '16:00:00', '17:00:00', 2, NULL, NULL, '', '', '', '2025-06-03 13:30:17', '2025-06-03 15:21:58', NULL),
(34, 1, 'Taize Prayer', 9, 26, '2025-06-11', '2025-06-11', 16, '12:00:00', '13:00:00', 2, NULL, NULL, '', '', '', '2025-06-03 13:35:52', '2025-06-03 14:54:14', NULL),
(35, 1, 'Acquaintance Party', NULL, NULL, '2025-06-19', '2025-06-19', 50, '12:00:00', '13:00:00', 3, 2, '', '', NULL, '', '2025-06-03 14:55:17', '2025-06-03 14:55:48', 'Party'),
(36, 9, 'bbquoh', 10, NULL, '2025-06-07', '2025-06-07', 16, '14:00:00', '15:00:00', 3, 5, '', 'ello', NULL, 'https://mail.google.com/mail/u/0/#sent/FMfcgzQbfVGttJXCzDfFLmMrWzttqPdH', '2025-06-03 16:14:58', '2025-06-03 16:17:17', NULL),
(38, 1, 'NITE', 7, NULL, '2025-06-09', '2025-06-10', 17, '07:00:00', '15:00:00', 3, 1, '', '', NULL, '', '2025-06-03 16:40:37', '2025-06-03 16:44:27', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tblusers`
--

CREATE TABLE `tblusers` (
  `id` int(11) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(500) DEFAULT NULL,
  `role` enum('admin','general_user') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblusers`
--

INSERT INTO `tblusers` (`id`, `google_id`, `email`, `first_name`, `last_name`, `profile_picture`, `role`, `created_at`, `updated_at`) VALUES
(1, '113541399770488302308', 'jane_allyson_paray@dlsl.edu.ph', 'JANE ALLYSON', 'PARAY', 'https://lh3.googleusercontent.com/a/ACg8ocKglLLzDtrZfSiWq67cQrk0r8n51Np9TNTTDTKzsUYCc8cE3A8=s96-c', 'admin', '2025-05-28 21:24:29', '2025-06-03 16:16:58'),
(2, NULL, 'mary.ann.lumban@dlsl.edu.ph\r\n', 'Mary Ann', 'Lumban', NULL, 'admin', '2025-05-28 23:26:21', '2025-05-28 23:26:21'),
(3, '', 'ilfo.office@dlsl.edu.ph', 'ILFO', 'Office', NULL, 'admin', '2025-05-28 23:26:21', '2025-05-28 23:26:21'),
(4, NULL, 'ilfo.manager@dlsl.edu.ph\r\n', 'ILFO', ' Manager', NULL, 'admin', '2025-05-28 23:27:06', '2025-05-28 23:27:06'),
(9, '101794583600979248508', 'jpcs@dlsl.edu.ph', 'Junior Philippine', 'Computer Society', 'https://lh3.googleusercontent.com/a/ACg8ocJNZT8u6eVgUCFAOdIOuRZFv5t0CUIrBjcQWg8vSxhTNaa7ecqg=s96-c', 'general_user', '2025-05-28 23:50:54', '2025-06-03 16:13:13'),
(10, '117522485736868523953', 'jhenelle_alonzo@dlsl.edu.ph', 'JHENELLE', 'ALONZO', 'https://lh3.googleusercontent.com/a/ACg8ocJ_JgmLps3F6boR1zAFfTRBbhFw2j6beM9sdhvUAXEupldplA=s96-c', 'general_user', '2025-06-03 01:16:30', '2025-06-03 13:22:15');

-- --------------------------------------------------------

--
-- Table structure for table `tblvenues`
--

CREATE TABLE `tblvenues` (
  `venue_id` int(11) NOT NULL,
  `venue_name` varchar(255) NOT NULL,
  `min_capacity` int(11) NOT NULL,
  `max_capacity` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblvenues`
--

INSERT INTO `tblvenues` (`venue_id`, `venue_name`, `min_capacity`, `max_capacity`, `is_active`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Mess Hall', 50, 200, 1, '2025-05-29 19:40:49', '2025-06-03 00:27:28', NULL, 1),
(2, 'Cabana 1', 15, 45, 1, '2025-05-29 19:40:49', '2025-06-03 00:28:44', NULL, 1),
(3, 'Cabana 2', 15, 45, 1, '2025-05-29 19:40:49', '2025-06-03 00:27:15', NULL, 1),
(4, 'Cabana 3', 15, 45, 1, '2025-05-29 19:40:49', '2025-06-03 00:27:18', NULL, 1),
(5, 'Cabana 4', 15, 45, 1, '2025-05-29 19:40:49', '2025-06-03 00:27:22', NULL, 1),
(25, 'Cabana 6', 1, 10, 0, '2025-06-02 13:20:04', '2025-06-02 13:22:09', 1, 1),
(26, 'Cabana 16', 15, 100, 0, '2025-06-02 23:20:54', '2025-06-03 15:22:18', 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tblactivities`
--
ALTER TABLE `tblactivities`
  ADD PRIMARY KEY (`activity_id`),
  ADD UNIQUE KEY `activity_name` (`activity_name`);

--
-- Indexes for table `tblapproval_status`
--
ALTER TABLE `tblapproval_status`
  ADD PRIMARY KEY (`status_id`),
  ADD UNIQUE KEY `status_name` (`status_name`);

--
-- Indexes for table `tblrejection_reasons`
--
ALTER TABLE `tblrejection_reasons`
  ADD PRIMARY KEY (`reason_id`),
  ADD UNIQUE KEY `reason_description` (`reason_description`);

--
-- Indexes for table `tblreservations`
--
ALTER TABLE `tblreservations`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `activity_id` (`activity_id`),
  ADD KEY `venue_id` (`venue_id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `rejection_reason_id` (`rejection_reason_id`);

--
-- Indexes for table `tblusers`
--
ALTER TABLE `tblusers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `google_id` (`google_id`);

--
-- Indexes for table `tblvenues`
--
ALTER TABLE `tblvenues`
  ADD PRIMARY KEY (`venue_id`),
  ADD UNIQUE KEY `venue_name` (`venue_name`),
  ADD KEY `fk_venues_created_by` (`created_by`),
  ADD KEY `fk_venues_updated_by` (`updated_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tblactivities`
--
ALTER TABLE `tblactivities`
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tblapproval_status`
--
ALTER TABLE `tblapproval_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tblrejection_reasons`
--
ALTER TABLE `tblrejection_reasons`
  MODIFY `reason_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tblreservations`
--
ALTER TABLE `tblreservations`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `tblusers`
--
ALTER TABLE `tblusers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tblvenues`
--
ALTER TABLE `tblvenues`
  MODIFY `venue_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tblreservations`
--
ALTER TABLE `tblreservations`
  ADD CONSTRAINT `tblreservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tblusers` (`id`),
  ADD CONSTRAINT `tblreservations_ibfk_2` FOREIGN KEY (`activity_id`) REFERENCES `tblactivities` (`activity_id`),
  ADD CONSTRAINT `tblreservations_ibfk_3` FOREIGN KEY (`venue_id`) REFERENCES `tblvenues` (`venue_id`),
  ADD CONSTRAINT `tblreservations_ibfk_4` FOREIGN KEY (`status_id`) REFERENCES `tblapproval_status` (`status_id`),
  ADD CONSTRAINT `tblreservations_ibfk_5` FOREIGN KEY (`rejection_reason_id`) REFERENCES `tblrejection_reasons` (`reason_id`);

--
-- Constraints for table `tblvenues`
--
ALTER TABLE `tblvenues`
  ADD CONSTRAINT `fk_venues_created_by` FOREIGN KEY (`created_by`) REFERENCES `tblusers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_venues_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tblusers` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
