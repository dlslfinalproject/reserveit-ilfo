-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 02, 2025 at 04:16 AM
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
(7, 'Others: Please specify'),
(3, 'Unavailable Date'),
(6, 'Unavailable Facilities');

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
  `link_to_csao_approved_poa` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `custom_activity_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblreservations`
--

INSERT INTO `tblreservations` (`reservation_id`, `user_id`, `event_name`, `activity_id`, `venue_id`, `reservation_startdate`, `reservation_enddate`, `number_of_participants`, `start_time`, `end_time`, `status_id`, `rejection_reason_id`, `rejection_other_notes`, `notes`, `link_to_csao_approved_poa`, `created_at`, `updated_at`, `custom_activity_name`) VALUES
(2, 1, 'Kjkdja', 1, NULL, '2025-06-23', '2025-07-02', 10, '14:10:00', '15:10:00', 1, NULL, NULL, '', '', '2025-06-01 09:14:41', '2025-06-01 09:14:41', NULL),
(3, 1, 'Jandsaj', 9, NULL, '2025-06-04', '2025-06-11', 1, '08:10:00', '16:20:00', 1, NULL, NULL, '', '', '2025-06-01 10:15:18', '2025-06-01 10:15:18', NULL),
(4, 1, 'Taize Prayer', 9, NULL, '2025-06-03', '2025-06-03', 44, '11:00:00', '17:00:00', 1, NULL, NULL, '', '', '2025-06-01 10:17:21', '2025-06-01 10:17:21', NULL),
(5, 1, 'dakjd', 10, NULL, '2025-06-04', '2025-06-04', 1, '15:15:00', '16:20:00', 1, NULL, NULL, '', '', '2025-06-02 00:24:47', '2025-06-02 00:24:47', NULL),
(6, 1, 'jandajdka', 8, NULL, '2025-06-17', '2025-06-17', 12, '15:05:00', '16:00:00', 1, NULL, NULL, '', '', '2025-06-02 00:28:13', '2025-06-02 00:28:13', NULL),
(7, 1, 'akdjalk', 6, NULL, '2025-06-17', '2025-06-18', 1, '16:20:00', '17:00:00', 1, NULL, NULL, '', '', '2025-06-02 00:29:37', '2025-06-02 00:29:37', NULL),
(8, 1, 'Prayer', NULL, NULL, '2025-06-24', '2025-06-24', 11, '18:20:00', '19:20:00', 1, NULL, NULL, '', '', '2025-06-02 00:44:32', '2025-06-02 00:44:32', 'Prayer'),
(9, 1, 'Taize Prayer', 3, NULL, '2025-06-20', '2025-06-26', 1, '07:00:00', '17:00:00', 1, NULL, NULL, '', '', '2025-06-02 00:51:54', '2025-06-02 00:51:54', NULL),
(10, 1, 'Prayer', NULL, NULL, '2025-06-12', '2025-06-13', 12, '07:00:00', '12:00:00', 1, NULL, NULL, '', '', '2025-06-02 01:47:31', '2025-06-02 01:47:31', 'Prayer');

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
(1, '113541399770488302308', 'jane_allyson_paray@dlsl.edu.ph', 'JANE ALLYSON', 'PARAY', 'https://lh3.googleusercontent.com/a/ACg8ocKglLLzDtrZfSiWq67cQrk0r8n51Np9TNTTDTKzsUYCc8cE3A8=s96-c', 'admin', '2025-05-28 21:24:29', '2025-06-02 01:42:03'),
(2, NULL, 'mary.ann.lumban@dlsl.edu.ph\r\n', 'Mary Ann', 'Lumban', NULL, 'admin', '2025-05-28 23:26:21', '2025-05-28 23:26:21'),
(3, '', 'ilfo.office@dlsl.edu.ph', 'ILFO', 'Office', NULL, 'admin', '2025-05-28 23:26:21', '2025-05-28 23:26:21'),
(4, NULL, 'ilfo.manager@dlsl.edu.ph\r\n', 'ILFO', ' Manager', NULL, 'admin', '2025-05-28 23:27:06', '2025-05-28 23:27:06'),
(9, '101794583600979248508', 'jpcs@dlsl.edu.ph', 'Junior Philippine', 'Computer Society', 'https://lh3.googleusercontent.com/a/ACg8ocJNZT8u6eVgUCFAOdIOuRZFv5t0CUIrBjcQWg8vSxhTNaa7ecqg=s96-c', 'general_user', '2025-05-28 23:50:54', '2025-06-02 01:57:50');

-- --------------------------------------------------------

--
-- Table structure for table `tblvenues`
--

CREATE TABLE `tblvenues` (
  `venue_id` int(11) NOT NULL,
  `venue_name` varchar(255) NOT NULL,
  `min_capacity` int(11) NOT NULL,
  `max_capacity` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblvenues`
--

INSERT INTO `tblvenues` (`venue_id`, `venue_name`, `min_capacity`, `max_capacity`, `description`, `is_active`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Mess Hall', 50, 200, NULL, 1, '2025-05-29 19:40:49', '2025-05-29 19:40:49', NULL, NULL),
(2, 'Cabana 1', 15, 45, NULL, 1, '2025-05-29 19:40:49', '2025-05-29 19:40:49', NULL, NULL),
(3, 'Cabana 2', 15, 45, NULL, 1, '2025-05-29 19:40:49', '2025-05-29 19:40:49', NULL, NULL),
(4, 'Cabana 3', 15, 45, NULL, 1, '2025-05-29 19:40:49', '2025-05-29 19:40:49', NULL, NULL),
(5, 'Cabana 4', 15, 45, NULL, 1, '2025-05-29 19:40:49', '2025-05-29 19:40:49', NULL, NULL);

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
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tblusers`
--
ALTER TABLE `tblusers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tblvenues`
--
ALTER TABLE `tblvenues`
  MODIFY `venue_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
