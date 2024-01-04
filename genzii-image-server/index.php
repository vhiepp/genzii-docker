<?php
  $image_path = isset($_GET['image']) ? $_GET['image'] : 'defaults/emty-bg.png';
  // Tải ảnh
  $image_info = getimagesize($image_path);
  // Lấy thông tin về loại ảnh
  $mime = $image_info['mime'];
  // Tùy thuộc vào loại ảnh, sử dụng hàm tương ứng để tạo ảnh mới từ phần cắt
  switch ($mime) {
    case 'image/jpeg':
      $image = imagecreatefromjpeg($image_path);
      break;
    case 'image/png':
      $image = imagecreatefrompng($image_path);
      break;
    case 'image/gif':
      $image = imagecreatefromgif($image_path);
      break;
    default:
      $image_path = 'defaults/emty-bg.png';
      $image = imagecreatefromjpeg('defaults/emty-bg.png');
      break;
  }  
  // Lấy kích thước ảnh gốc
  $original_width = imagesx($image);
  $original_height = imagesy($image);
  $desired_width = isset($_GET['w']) ? $_GET['w'] : $original_width;
  $desired_height = isset($_GET['h']) ? $_GET['h'] : $original_height;

  $desired_ratio = $desired_width / $desired_height;
  $new_width = $original_width;
  $new_height = $original_height;
  $current_ratio = $original_width / $original_height;
  if ($current_ratio > $desired_ratio) {
    // Ảnh cần cắt theo chiều rộng
    $new_width = $original_height * $desired_ratio;
  } else {
    // Ảnh cần cắt theo chiều cao
    $new_height = $original_width / $desired_ratio;
  }
  $image = imagecrop($image, [
    'x' => ($original_width - $new_width) / 2,
    'y' => ($original_height - $new_height) / 2,
    'width' => $new_width,
    'height' => $new_height
  ]);
  $original_width = imagesx($image);
  $original_height = imagesy($image);
  // Tạo ảnh mới với kích thước mở rộng
  $new_image = imagecreatetruecolor($desired_width, $desired_height);
  $bg_red = isset($_GET['red']) ? $_GET['red'] : 255;
  $bg_green = isset($_GET['green']) ? $_GET['green'] : 255;
  $bg_blue = isset($_GET['blue']) ? $_GET['blue'] : 255;
  // Tô màu nền trắng cho ảnh mới
  $background_color = imagecolorallocate($new_image, $bg_red, $bg_green, $bg_blue);
  imagefill($new_image, 0, 0, $background_color);

  // Sao chép và thay đổi kích thước ảnh gốc vào ảnh mới
  imagecopyresampled($new_image, $image, 0, 0, 0, 0, $desired_width, $desired_height, $original_width, $original_height);

  if (isset($_GET['text'])) {
    $text = $_GET['text'];

    $text_color_red = isset($_GET['text_red']) ? $_GET['text_red'] : 255 - $bg_red;
    $text_color_green = isset($_GET['text_green']) ? $_GET['text_green'] : 255 - $bg_green;
    $text_color_blue = isset($_GET['text_blue']) ? $_GET['text_blue'] : 255 - $bg_blue;

    $text_color = imagecolorallocate($new_image, $text_color_red, $text_color_green, $text_color_blue);
    $text_size = isset($_GET['text_size']) ? $_GET['text_size'] : 34;
    $text_box = imagettfbbox($text_size, 0, 'font/JosefinSans-Bold.ttf', $text);
    $text_width = $text_box[2] - $text_box[0];
    $text_height = $text_box[1] - $text_box[7];
    $text_x = ($desired_width - $text_width) / 2;
    $text_y = ($desired_height + $text_height) / 2;
    imagettftext($new_image, $text_size, 0, $text_x, $text_y, $text_color, 'font/JosefinSans-Bold.ttf', $text);
  }
  // Hiển thị ảnh mới hoặc lưu vào một đường dẫn cụ thể
  header('Content-Type: image/jpeg');
  imagejpeg($new_image);

  // Giải phóng bộ nhớ sau khi hoàn thành
  imagedestroy($image);
  imagedestroy($new_image);
