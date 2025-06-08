# DNS Amplification Attack Simulator

🎓 **MÔ PHỎNG GIÁO DỤC VỀ DNS AMPLIFICATION DDOS ATTACK**

⚠️ **CẢNH BÁO QUAN TRỌNG: Mã này chỉ dành cho mục đích giáo dục và nghiên cứu bảo mật. KHÔNG được sử dụng để thực hiện tấn công thực tế. Việc tấn công hệ thống mạng là bất hợp pháp và có thể bị xử lý hình sự. Người dùng chịu hoàn toàn trách nhiệm cho việc sử dụng mã này.**

## 📚 Mục đích

- Mô phỏng và hiểu rõ cách thức hoạt động của DNS Amplification Attack
- Nghiên cứu kỹ thuật tấn công để phát triển biện pháp phòng chống hiệu quả
- Cung cấp công cụ học tập cho sinh viên, chuyên gia bảo mật và nhà nghiên cứu

## 🛠️ Yêu cầu hệ thống

- Node.js phiên bản 14.0.0 trở lên
- NPM hoặc Yarn
- Trình soạn thảo mã (như VSCode, Sublime Text, v.v.)
- Kết nối Internet để thực hiện DNS queries

## 🚀 Cài đặt

1. Clone repository (hoặc tải mã nguồn xuống)
2. Cài đặt các dependencies:
   ```bash
   npm install
   ```
   hoặc
   ```bash
   npm run install-deps
   ```

## 📋 Các thành phần

Project bao gồm các file sau:

1. `dns_amplification_simulator.js` - Mô phỏng chính về DNS Amplification Attack
2. `ip_spoofing_simulator.js` - Mô phỏng giáo dục về IP Spoofing (không thực hiện IP spoofing thực tế)
3. `package.json` - Cấu hình project và dependencies
4. `README.md` - Tài liệu hướng dẫn sử dụng

## 🔬 Cách sử dụng

### Chạy mô phỏng DNS Amplification Attack

```bash
npm start
```
hoặc
```bash
node dns_amplification_simulator.js
```

### Chạy mô phỏng IP Spoofing (mục đích giáo dục)

```bash
npm run ip-spoof-demo
```
hoặc
```bash
node ip_spoofing_simulator.js
```

## 📖 Giải thích mã nguồn

### 1. DNS Amplification Simulator

Mô phỏng quá trình:
1. Tạo DNS query loại "ANY" (yêu cầu tất cả bản ghi DNS của một domain)
2. Gửi query đến DNS resolvers công khai
3. Đo kích thước query và phản hồi để tính toán hệ số khuếch đại
4. Mô phỏng nhiều bots gửi queries song song (mô phỏng botnet)
5. Phân tích kết quả và tạo báo cáo

### 2. IP Spoofing Simulator

Giải thích nguyên lý:
1. Mô phỏng cách hoạt động của IP spoofing trong DNS Amplification Attack
2. Giải thích kỹ thuật và yêu cầu để thực hiện IP spoofing
3. Lưu ý rằng Node.js tiêu chuẩn không thể thực hiện IP spoofing thực tế
4. Cung cấp thông tin về biện pháp phòng chống

## 🔒 Giới hạn kỹ thuật

1. **IP Spoofing**: Node.js tiêu chuẩn không thể thực hiện IP spoofing thực tế. Mã này chỉ mô phỏng nguyên lý hoạt động.
2. **DNS Amplification**: Mô phỏng sử dụng các DNS resolver công khai, nhưng giới hạn số lượng queries để tránh gây tải cho các dịch vụ này.
3. **Botnet Simulation**: Mô phỏng botnet bằng cách tạo các requests song song, không phải botnet thực tế.

## 🔍 Các khái niệm cốt lõi

### DNS Amplification Attack

- **Định nghĩa**: Tấn công DDoS sử dụng các DNS resolver mở để khuếch đại lưu lượng tấn công
- **Cơ chế**: Kẻ tấn công gửi truy vấn DNS với địa chỉ IP nguồn giả mạo là địa chỉ của nạn nhân
- **Khuếch đại**: Sử dụng loại truy vấn "ANY" để tạo phản hồi lớn hơn nhiều lần so với truy vấn
- **Hiệu quả**: Tạo lưu lượng khổng lồ với chi phí tối thiểu, dẫn đến từ chối dịch vụ

### IP Spoofing

- **Định nghĩa**: Kỹ thuật giả mạo địa chỉ IP nguồn trong gói tin mạng
- **Cơ chế**: Sửa đổi IP header để thay đổi địa chỉ IP nguồn
- **Yêu cầu**: Raw socket, quyền root, và hỗ trợ của kernel và mạng
- **Phòng chống**: BCP 38, Source Address Validation, Reverse Path Forwarding

## 🛡️ Biện pháp phòng chống

### Cho DNS Server

1. Vô hiệu hóa đệ quy mở (open recursion)
2. Giới hạn DNS query chỉ cho client được ủy quyền
3. Triển khai Response Rate Limiting (RRL)
4. Chặn hoặc giới hạn truy vấn loại "ANY"

### Cho ISP/Network

1. Triển khai BCP 38 (Source Address Validation)
2. Lọc các gói tin với IP spoofed
3. Giám sát lưu lượng DNS bất thường

### Cho tổ chức/người dùng

1. Sử dụng dịch vụ DDoS mitigation
2. Triển khai firewall với khả năng phát hiện DDoS
3. Xây dựng kế hoạch ứng phó sự cố
4. Giám sát băng thông và lưu lượng mạng

## 📄 Giấy phép

Mã này được phân phối dưới giấy phép MIT, CHỈ dành cho mục đích giáo dục và nghiên cứu.

## 🔗 Tài liệu tham khảo

1. RFC 5358 - Preventing Use of Recursive Nameservers in Reflector Attacks
2. BCP 38 - Network Ingress Filtering
3. US-CERT - DNS Amplification Attacks
4. IETF - Measures for DNS Reflection Protection
