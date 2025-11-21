# Quizplosion – Quiz + Exploding Kittens

**Quizplosion** là trò chơi kết hợp giữa **trả lời câu hỏi** và **rút bài kiểu Exploding Kittens**. Phục vụ cho việc giảng dạy thêm phần thú vị.  
Trả lời đúng → được rút bài liên tục để kiếm điểm.  
Rút trúng **Bomb** hoặc **Nuclear** → nổ → mất hết điểm!  
Bạn có thể **dừng bất cứ lúc nào** để giữ điểm an toàn.

Dự án được viết bằng **Typescript**.

## Mục lục

- [Luật chơi](#luật-chơi)
  - [1. Chuẩn bị](#1-chuẩn-bị)
  - [2. Trả lời đúng](#2-trả-lời-đúng)
  - [3. Trả lời sai](#3-trả-lời-sai)
  - [4. Kết thúc](#4-kết-thúc)
- [Các loại thẻ bài](#các-loại-thẻ-bài)
- [Cách chạy dự án](#cách-chạy-dự-án)
  - [Yêu cầu](#yêu-cầu)
  - [Các bước](#các-bước)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Tác giả & góp ý](#tác-giả--góp-ý)

## Luật chơi

### 1. Chuẩn bị

- Các nhóm bốc thăm chọn thứ tự trả lời.
- Mỗi nhóm lần lượt chọn 1 câu hỏi để trả lời.

### 2. Trả lời đúng

- Nhóm được **bắt buộc rút ít nhất 1 lá bài**.
- Sau đó nhóm có thể **rút tiếp liên tục** cho đến khi:
  - Rút trúng lá **Bomb** hoặc **Nuclear** → **dừng ngay lập tức**.
  - Hoặc tự chọn **Dừng lại** để giữ điểm an toàn.
- Các lá bài có hiệu ứng:
  | Lá bài | Hiệu ứng |
  |-------------|--------------------------------------------|
  | +1 → +5 | Cộng điểm tương ứng |
  | ×2 (multiple) | Nhân đôi điểm hiện tại |
  | ÷2 (divide) | Chia đôi điểm hiện tại (làm tròn xuống) |
  | Swap (change) | Đổi điểm với một đội ngẫu nhiên |
  | Lose All | Mất hết điểm hiện tại |
  | Bomb | 💣 Nổ! Mất hết điểm lượt này |
  | NUCLEAR | ☢️ Nổ hạt nhân! Game over (phiên bản đầy đủ) |

### 3. Trả lời sai

- Các nhóm khác được quyền **cướp câu hỏi** theo thứ tự đã bốc thăm.
- Nhóm cướp trả lời đúng → được rút bài (hoặc không rút).
- Nhóm cướp trả lời sai → bị trừ **nửa điểm hiện tại** (làm tròn xuống).
- Nếu không ai trả lời đúng → hiện đáp án, chuyển câu hỏi mới.

### 4. Kết thúc

- Sau khi hết câu hỏi → đội có **điểm cao nhất** thắng!

---

## Cách chạy dự án

### Yêu cầu

- Node.js (đã cài sẵn `npm`)
- VS Code + extension **Live Server**

### Các bước

```bash
# 1. Clone dự án
git clone https://github.com/tên-user-của-bạn/quizplosion.git
cd quizplosion

# 2. Cài dependency (chỉ có TypeScript)
npm install

# 3. Build TypeScript → JavaScript
npm run build
# → File sẽ xuất ra thư mục /dist

# 4. Mở file index.html bằng Live Server
#    Cách nhanh nhất trong VS Code:
#    → Chuột phải vào file index.html → "Open with Live Server"
```

### Cấu trúc thư mục

```bash
quizplosion/
├── src/               # Core
├── assets/            # Hình nền, icon, ảnh minh hoạ câu hỏi
├── dist/              # File JS đã build (tạo tự động)
├── index.html         # Trang chơi chính
├── webcauhoi.txt      # Tài liệu luật gốc
├── package.json
└── README.md          # File bạn đang đọc
```

### Tác giả & góp ý

Made with love bởi **3 ku em sinh viên năm 3 từ trường Cao Đẳng Kỹ Thuật Cao Thắng**.
Ý tưởng gốc từ trò chơi Exploding Kittens
