# ![tutor](./public/img/tutor-logo.jpg)

Tutor 是一個可以提供使用者選擇家教的教學平台

## 產品功能

### 1. 使用者瀏覽首頁
   - 未登入的使用者或學生可以瀏覽首頁，查看學生的學習時數排行，以及家教老師清單
   - 若使用者身分為老師，無法瀏覽首頁，會切換到老師的個人檔案
   - 可依照不同類別選擇家教老師
   
### 2. 使用者可以使用 email 和 password 註冊帳號：
   - 註冊後可以登入/登出
   - 成功登入的使用者才可以使用預約課程的服務

### 3. 成為老師：
   - 使用者登入後，預設為學生身分，可點擊`成為老師`按鈕，填寫表單，成為老師
     - 表單內容：姓名、國籍、簡介、類別、教學風格、課程內容、每周方便的星期

### 4. 使用者為學生：
   - 成功登入後，進入首頁，點擊家教老師的`瀏覽更多`按鈕可以瀏覽家教老師的個人資料
  
   - 成功登入後，進入首頁，點擊`預約課程`按鈕可以預約老師開設的課程，可以藉由周曆選擇課程的`課程名稱`、`時間(年/月/日/星期)`、`課程時長`，`淺灰色`的時段表示可預約的時間，`深灰色`為不可預約的時間
  
   - 點擊右上方使用者頭像，選擇`個人檔案`，會顯示所有`使用者預約的課程`、`使用者頭像`、`使用者的學習名次及學習時數`、`自我介紹`

   - 點擊`編輯個人檔案`，可以修改`姓名`、`大頭照`、`自我介紹`
   
   - 點擊`預約課程的圖示`，可以對今天以前預約過的課程 (白色) `評分`、`評論`，無法`評分`、`評論`的課程為深灰色
  
   - 若預約課程的時間在今天以後，可以`取消預約`

### 5. 使用者為老師：
   - 進入個人檔案，可以瀏覽及修改`個人頭像`、`老師的姓名`、`國籍`、`課程類別`、`老師的簡介`、`教學風格`、`授課時間`，但是只能查看`課程評價`
   
   - 點擊`授課時間`右方的`鉛筆圖示`，周曆下方會顯示`+`，點擊`+`圖示，需填寫`課程名稱`、`課程介紹`、`課程類別`、`課程連結`、`課程時長` (30 or 60 min) 、`課程時段`，即可新增課程
   
   - 點擊右上方的`老師頭像`，選擇`我的課程`，可以瀏覽老師的`課程行事曆`，會依照時間顯示所有開設的課程，確定自己開設的課程是否有學生預約
   
   - 老師可以切換為學生身分，即可預約課程

### 6. 後台：
   - 只有管理者可以瀏覽後台，查看`使用者清單`

## 測試帳號

### 1. 學生：
   - 帳號：user3@example.com
   - 密碼：12345678
  
### 2. 老師：
   - 帳號：teacher2@example.com
   - 密碼：12345678
  
### 3. 管理員：
   - 帳號：root@example.com
   - 密碼：12345678

## 後端

### 開發環境

- [Node.js v18.15.0](https://nodejs.org/en)
- [MySQL v8.0.15](https://downloads.mysql.com/archives/installer/)

### 系統架構

![系統架構](./public/img/system-structure.jpg)

### 資料庫架構

![ERD](./public/img/tutor-ERD.png)

## Demo

### 1. 使用者瀏覽首頁

<video src="https://github.com/yuan6636/capstone-tutor-backend/assets/142104301/1c44ccba-e8c6-49a9-9895-41f12dfa0d0a">
  Your browser doesn't support embedded video.
  ![Click here to watch the video](https://youtu.be/2i5FEng0UYI)
</video>

### 2. 使用者註冊/登入

<video src="https://github.com/yuan6636/capstone-tutor-backend/assets/142104301/0ac2f045-c0f1-4c93-876d-657ef2d1266f">
  Your browser doesn't support embedded video.
  ![Click here to watch the video](https://youtu.be/NwJ8cvXbORY)
</video>

### 3. 學生成為老師

<video src="https://github.com/yuan6636/capstone-tutor-backend/assets/142104301/4b9e952e-c7a4-4088-8b5f-100f98dfb92b">
  Your browser doesn't support embedded video.
  ![Click here to watch the video](https://youtu.be/c0Xivgh7vu0)
</video>

### 4. 學生使用tutor

<video src="https://github.com/yuan6636/capstone-tutor-backend/assets/142104301/3e22a952-ce79-4ba7-bd2e-3ca702129e7f">
  Your browser doesn't support embedded video.
  ![Click here to watch the video](https://youtu.be/DE00mnE5opA)
</video>

### 5. 老師使用tutor

<video src="https://github.com/yuan6636/capstone-tutor-backend/assets/142104301/f7ae9022-26bf-45b8-85ae-6b68643b4adf">
  Your browser doesn't support embedded video.
  ![Click here to watch the video](https://youtu.be/aNJTaP2Uu9U)
</video>

### 6. 後台

<video src="https://github.com/yuan6636/capstone-tutor-backend/assets/142104301/7231c20a-078d-473d-91cf-9a01d7a03bb4">
  Your browser doesn't support embedded video.
  ![Click here to watch the video](https://youtu.be/X_ZAF8KfPxg)
</video>

## 專案畫面

### 首頁
![home](./public/img/home.jpg)

### 以學生身分瀏覽我的檔案
![student](./public/img/student.jpg)

### 以學生身分瀏覽我的課程
![student-course](./public/img/student-course.jpg)

### 以老師身分瀏覽我的檔案
![teacher](./public/img/teacher.jpg)

### 以老師身分瀏覽我的課程
![teacher-course](./public/img/teacher-course.jpg)

### Team

 - Front-end - [Elaine](https://github.com/yuri1022)
 - Front-end - [Kai](https://github.com/enternalsong) 
 - Back-end - [Chris](https://github.com/yuan6636)
 - Back-end - [Tommy](https://github.com/Tommy0901)
 - UI - 北極