<?php
session_start();
if (isset($_SESSION['conversation'])) {
    unset($_SESSION['conversation']);
}
?>