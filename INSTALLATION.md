# Hướng dẫn cài đặt và sử dụng DNS Amplification Attack Simulator

## Bước 1: Chuẩn bị môi trường

### Yêu cầu
- Node.js phiên bản 14.0.0 trở lên
- NPM (Node Package Manager)
- Trình soạn thảo code (VSCode, Sublime Text, v.v.)
- Kết nối internet để thực hiện DNS queries

### Kiểm tra Node.js và NPM
```bash
node -v
npm -v
```

## Bước 2: Tải mã nguồn

### Tùy chọn 1: Clone repository (nếu sử dụng Git)
```bash
git clone <repository-url>
cd dns-amplification-attack-simulator
```

### Tùy chọn 2: Tải xuống các file riêng lẻ
Tạo thư mục mới và tải các file sau vào thư mục đó:
- dns_amplification_simulator.js
- ip_spoofing_simulator.js
- demo.js
- package.json
- README.md

## Bước 3: Cài đặt dependencies

Di chuyển vào thư mục dự án và chạy lệnh:
```bash
npm install
```
hoặc
```bash
npm run install-deps
```

## Bước 4: Chạy các simulator

### Xem trợ giúp
```bash
npm run help
```

### Chạy DNS Amplification Simulator
```bash
npm start
```

### Chạy IP Spoofing Simulator (mô phỏng nguyên lý)
```bash
npm run ip-spoof-demo
```

### Chạy demo tổng hợp (khuyến nghị cho lần chạy đầu tiên)
```bash
npm run demo
```

## Bước 5: Đọc hiểu kết quả

### Trong DNS Amplification Simulator:
- Quan sát các giai đoạn của cuộc tấn công
- Xem thống kê về tỷ lệ khuếch đại
- Đọc báo cáo phân tích
- Tìm hiểu biện pháp phòng chống

### Trong IP Spoofing Simulator:
- Hiểu nguyên lý của IP spoofing
- Xem mô phỏng các bước giả mạo IP
- Đọc giải thích kỹ thuật
- Tìm hiểu giới hạn kỹ thuật và biện pháp phòng chống

## Bước 6: Khám phá mã nguồn

### File chính:
- `dns_amplification_simulator.js`: Mô phỏng DNS Amplification Attack
- `ip_spoofing_simulator.js`: Mô phỏng nguyên lý IP Spoofing
- `demo.js`: Demo tổng hợp

### Các class và phương thức quan trọng:
- `DNSAmplificationSimulator`: Class chính mô phỏng cuộc tấn công
  - `createAmplificationQuery()`: Tạo DNS query loại ANY
  - `sendDNSQuery()`: Gửi query tới DNS resolver
  - `simulateBotnetAttack()`: Mô phỏng botnet

- `IPSpoofingSimulator`: Class mô phỏng nguyên lý IP spoofing
  - `simulateSpoofedDNSQuery()`: Mô phỏng quá trình spoofing
  - `explainIPSpoofing()`: Giải thích kỹ thuật

## Lưu ý quan trọng

⚠️ **MỤC ĐÍCH GIÁO DỤC**: Mã này chỉ dành cho mục đích học tập và nghiên cứu bảo mật.

⚠️ **KHÔNG TẤN CÔNG**: KHÔNG được sử dụng mã này để thực hiện tấn công thực tế vào hệ thống không được ủy quyền.

⚠️ **GIỚI HẠN KỸ THUẬT**: Mã này là mô phỏng giáo dục, không thể thực hiện IP spoofing thực tế trong Node.js tiêu chuẩn.

⚠️ **TRÁCH NHIỆM PHÁP LÝ**: Người dùng chịu hoàn toàn trách nhiệm về việc sử dụng mã này.
