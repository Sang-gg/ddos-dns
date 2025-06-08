
/**
 * DNS Amplification Attack Simulator - Educational Purpose Only
 * 
 * CẢNH BÁO QUAN TRỌNG:
 * - Mã này chỉ dành cho mục đích giáo dục và nghiên cứu bảo mật
 * - KHÔNG được sử dụng để thực hiện tấn công thực tế
 * - Việc sử dụng mã này để tấn công hệ thống thực tế là bất hợp pháp
 * - Người dùng chịu trách nhiệm hoàn toàn cho việc sử dụng mã này
 * 
 * Mục đích: Hiểu rõ cách thức hoạt động của DNS Amplification Attack
 * để có thể phòng chống hiệu quả
 */

const dgram = require('dgram');
const dnsPacket = require('dns-packet');
const fs = require('fs');

class DNSAmplificationSimulator {
    constructor() {
        this.isSimulating = false;
        this.config = {
            // Danh sách DNS resolvers công khai (chỉ dùng cho simulation)
            dnsResolvers: [
                '8.8.8.8',        // Google DNS
                '1.1.1.1',        // Cloudflare DNS
                '208.67.222.222', // OpenDNS
                '9.9.9.9'         // Quad9 DNS
            ],
            dnsPort: 53,
            amplificationFactor: 0, // Sẽ được tính toán
            maxQueries: 10, // Giới hạn cho mục đích giáo dục
            delayBetweenQueries: 1000, // 1 giây giữa các query
        };

        this.logEntries = [];
        this.stats = {
            queriesSent: 0,
            responsesReceived: 0,
            totalBytesIn: 0,
            totalBytesOut: 0,
            amplificationFactors: []
        };
    }

    /**
     * Tạo DNS query với loại "ANY" để tối đa hóa kích thước phản hồi
     * Đây là kỹ thuật chính trong DNS Amplification Attack
     */
    createAmplificationQuery(domain = 'google.com') {
        const query = {
            type: 'query',
            id: Math.floor(Math.random() * 65535),
            flags: dnsPacket.RECURSION_DESIRED,
            questions: [{
                type: 'ANY', // Yêu cầu tất cả bản ghi DNS
                name: domain,
                class: 'IN'
            }]
        };

        return dnsPacket.encode(query);
    }

    /**
     * Mô phỏng gửi DNS query tới DNS resolver
     * Trong tấn công thực tế, địa chỉ IP nguồn sẽ bị spoofed
     */
    async sendDNSQuery(resolver, queryBuffer, targetDomain) {
        return new Promise((resolve, reject) => {
            const client = dgram.createSocket('udp4');
            const startTime = Date.now();

            // Thiết lập timeout
            const timeout = setTimeout(() => {
                client.close();
                reject(new Error('Query timeout'));
            }, 5000);

            client.on('message', (response, rinfo) => {
                clearTimeout(timeout);
                const endTime = Date.now();
                const responseTime = endTime - startTime;

                try {
                    const decoded = dnsPacket.decode(response);
                    const amplificationFactor = response.length / queryBuffer.length;

                    const result = {
                        resolver: resolver,
                        domain: targetDomain,
                        querySize: queryBuffer.length,
                        responseSize: response.length,
                        amplificationFactor: amplificationFactor,
                        responseTime: responseTime,
                        answers: decoded.answers || [],
                        timestamp: new Date().toISOString()
                    };

                    this.updateStats(queryBuffer.length, response.length, amplificationFactor);
                    this.logEntry('RESPONSE', result);

                    client.close();
                    resolve(result);
                } catch (error) {
                    client.close();
                    reject(error);
                }
            });

            client.on('error', (error) => {
                clearTimeout(timeout);
                client.close();
                reject(error);
            });

            // Gửi query
            client.send(queryBuffer, 0, queryBuffer.length, this.config.dnsPort, resolver, (error) => {
                if (error) {
                    clearTimeout(timeout);
                    client.close();
                    reject(error);
                } else {
                    this.logEntry('QUERY', {
                        resolver: resolver,
                        domain: targetDomain,
                        querySize: queryBuffer.length,
                        timestamp: new Date().toISOString()
                    });
                }
            });
        });
    }

    /**
     * Mô phỏng botnet gửi multiple queries
     * Trong thực tế, đây sẽ là hàng nghìn máy tính từ botnet
     */
    async simulateBotnetAttack(targetDomain = 'google.com', numberOfBots = 5) {
        console.log('\n🔬 BẮT ĐẦU MÔ PHỎNG DNS AMPLIFICATION ATTACK');
        console.log('📚 Mục đích: Giáo dục và nghiên cứu bảo mật');
        console.log('⚠️  CẢNH BÁO: Không sử dụng cho mục đích tấn công thực tế\n');

        this.isSimulating = true;
        this.resetStats();

        console.log(`🎯 Target Domain: ${targetDomain}`);
        console.log(`🤖 Simulated Bots: ${numberOfBots}`);
        console.log(`🌐 DNS Resolvers: ${this.config.dnsResolvers.length}`);
        console.log('\n📡 Bắt đầu gửi DNS queries...\n');

        const promises = [];

        for (let botId = 0; botId < numberOfBots; botId++) {
            for (let resolverIndex = 0; resolverIndex < this.config.dnsResolvers.length; resolverIndex++) {
                const resolver = this.config.dnsResolvers[resolverIndex];

                const promise = this.simulateBotQuery(botId, resolver, targetDomain, resolverIndex * 200);
                promises.push(promise);

                // Giới hạn số lượng queries để tránh spam
                if (promises.length >= this.config.maxQueries) {
                    break;
                }
            }

            if (promises.length >= this.config.maxQueries) {
                break;
            }
        }

        try {
            const results = await Promise.allSettled(promises);
            this.analyzeResults(results);
        } catch (error) {
            console.error('❌ Lỗi trong quá trình simulation:', error.message);
        }

        this.isSimulating = false;
        this.generateReport();
    }

    /**
     * Mô phỏng một bot gửi query
     */
    async simulateBotQuery(botId, resolver, domain, delay = 0) {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                try {
                    const queryBuffer = this.createAmplificationQuery(domain);
                    console.log(`🤖 Bot-${botId} → ${resolver}: Gửi DNS ANY query cho ${domain}`);

                    const result = await this.sendDNSQuery(resolver, queryBuffer, domain);

                    console.log(`📨 Bot-${botId} ← ${resolver}: Nhận ${result.responseSize} bytes (×${result.amplificationFactor.toFixed(2)})`);

                    resolve(result);
                } catch (error) {
                    console.log(`❌ Bot-${botId}: Lỗi khi query ${resolver} - ${error.message}`);
                    reject(error);
                }
            }, delay);
        });
    }

    /**
     * Cập nhật thống kê
     */
    updateStats(querySize, responseSize, amplificationFactor) {
        this.stats.queriesSent++;
        this.stats.responsesReceived++;
        this.stats.totalBytesOut += querySize;
        this.stats.totalBytesIn += responseSize;
        this.stats.amplificationFactors.push(amplificationFactor);
    }

    /**
     * Reset thống kê
     */
    resetStats() {
        this.stats = {
            queriesSent: 0,
            responsesReceived: 0,
            totalBytesOut: 0,
            totalBytesIn: 0,
            amplificationFactors: []
        };
        this.logEntries = [];
    }

    /**
     * Ghi log entry
     */
    logEntry(type, data) {
        this.logEntries.push({
            type: type,
            timestamp: new Date().toISOString(),
            data: data
        });
    }

    /**
     * Phân tích kết quả
     */
    analyzeResults(results) {
        console.log('\n📊 PHÂN TÍCH KẾT QUẢ MÔ PHỎNG\n');

        const successful = results.filter(r => r.status === 'fulfilled');
        const failed = results.filter(r => r.status === 'rejected');

        console.log(`✅ Queries thành công: ${successful.length}`);
        console.log(`❌ Queries thất bại: ${failed.length}`);

        if (successful.length > 0) {
            const amplificationFactors = successful.map(r => r.value.amplificationFactor);
            const avgAmplification = amplificationFactors.reduce((a, b) => a + b, 0) / amplificationFactors.length;
            const maxAmplification = Math.max(...amplificationFactors);
            const minAmplification = Math.min(...amplificationFactors);

            console.log(`\n🔍 THÔNG SỐ KHUẾCH ĐẠI:`);
            console.log(`   • Trung bình: ${avgAmplification.toFixed(2)}x`);
            console.log(`   • Tối đa: ${maxAmplification.toFixed(2)}x`);
            console.log(`   • Tối thiểu: ${minAmplification.toFixed(2)}x`);

            console.log(`\n📈 THÔNG SỐ LƯU LƯỢNG:`);
            console.log(`   • Tổng bytes gửi: ${this.stats.totalBytesOut} bytes`);
            console.log(`   • Tổng bytes nhận: ${this.stats.totalBytesIn} bytes`);
            console.log(`   • Tỷ lệ khuếch đại tổng: ${(this.stats.totalBytesIn / this.stats.totalBytesOut).toFixed(2)}x`);
        }
    }

    /**
     * Tạo báo cáo chi tiết
     */
    generateReport() {
        console.log('\n📄 TẠO BÁO CÁO CHI TIẾT...');

        const report = {
            simulation: {
                timestamp: new Date().toISOString(),
                purpose: 'Educational DNS Amplification Attack Simulation',
                warning: 'This simulation is for educational purposes only',
            },
            configuration: this.config,
            statistics: this.stats,
            logs: this.logEntries,
            analysis: {
                averageAmplification: this.stats.amplificationFactors.length > 0 
                    ? this.stats.amplificationFactors.reduce((a, b) => a + b, 0) / this.stats.amplificationFactors.length 
                    : 0,
                totalAmplification: this.stats.totalBytesOut > 0 
                    ? this.stats.totalBytesIn / this.stats.totalBytesOut 
                    : 0,
                effectiveness: this.stats.responsesReceived / Math.max(this.stats.queriesSent, 1) * 100
            }
        };

        const reportJson = JSON.stringify(report, null, 2);

        try {
            fs.writeFileSync('dns_amplification_simulation_report.json', reportJson);
            console.log('✅ Báo cáo đã được lưu: dns_amplification_simulation_report.json');
        } catch (error) {
            console.log('❌ Không thể lưu báo cáo:', error.message);
        }

        this.displayMitigationAdvice();
    }

    /**
     * Hiển thị lời khuyên về phòng chống
     */
    displayMitigationAdvice() {
        console.log('\n🛡️  BIỆN PHÁP PHÒNG CHỐNG DNS AMPLIFICATION ATTACK:\n');

        console.log('1. 🔧 Cấu hình DNS Server:');
        console.log('   • Vô hiệu hóa đệ quy mở (open recursion)');
        console.log('   • Hạn chế truy cập DNS chỉ cho client được ủy quyền');
        console.log('   • Triển khai Rate Limiting (RRL)');
        console.log('   • Chặn hoặc hạn chế query loại "ANY"\n');

        console.log('2. 🌐 Cấp ISP/Network:');
        console.log('   • Triển khai BCP 38 (Source Address Validation)');
        console.log('   • Lọc các gói tin với IP spoofed');
        console.log('   • Giám sát lưu lượng DNS bất thường\n');

        console.log('3. 🏢 Cấp tổ chức:');
        console.log('   • Sử dụng dịch vụ DDoS mitigation');
        console.log('   • Triển khai firewall với khả năng phát hiện DDoS');
        console.log('   • Xây dựng kế hoạch ứng phó sự cố');
        console.log('   • Giám sát băng thông và lưu lượng mạng\n');
    }

    /**
     * Hiển thị thông tin về nguyên lý hoạt động
     */
    displayAttackPrinciples() {
        console.log('\n📚 NGUYÊN LÝ HOẠT ĐỘNG DNS AMPLIFICATION ATTACK:\n');

        console.log('1. 🎯 Mục tiêu: Tấn công từ chối dịch vụ (DDoS)');
        console.log('2. 🔄 Cơ chế: Khuếch đại lưu lượng thông qua DNS');
        console.log('3. 🎭 Kỹ thuật: IP Spoofing + Open DNS Resolvers');
        console.log('4. 📊 Hiệu quả: Truy vấn nhỏ → Phản hồi lớn\n');

        console.log('🔍 CÁC BƯỚC THỰC HIỆN:');
        console.log('   ① Kẻ tấn công sử dụng botnet');
        console.log('   ② Giả mạo IP nguồn thành IP nạn nhân');
        console.log('   ③ Gửi DNS query "ANY" tới open resolvers');
        console.log('   ④ DNS servers gửi phản hồi lớn về IP nạn nhân');
        console.log('   ⑤ Nạn nhân bị quá tải bởi lưu lượng khuếch đại\n');
    }
}

// Hàm chính để chạy simulation
async function runSimulation() {
    const simulator = new DNSAmplificationSimulator();

    // Hiển thị thông tin giáo dục
    simulator.displayAttackPrinciples();

    console.log('⚠️  CẢNH BÁO PHÁP LÝ:');
    console.log('   • Mã này chỉ dành cho mục đích giáo dục');
    console.log('   • Không được sử dụng để tấn công hệ thống thực tế');
    console.log('   • Việc tấn công mạng là bất hợp pháp và có thể bị xử lý hình sự\n');

    // Chạy simulation với tham số giới hạn
    await simulator.simulateBotnetAttack('example.com', 3);
}

// Xuất module
module.exports = {
    DNSAmplificationSimulator,
    runSimulation
};

// Chạy simulation nếu file được gọi trực tiếp
if (require.main === module) {
    console.log('🎓 DNS AMPLIFICATION ATTACK EDUCATIONAL SIMULATOR');
    console.log('📖 Mục đích: Học tập và nghiên cứu bảo mật mạng\n');

    runSimulation().catch(error => {
        console.error('❌ Lỗi khi chạy simulation:', error);
    });
}
