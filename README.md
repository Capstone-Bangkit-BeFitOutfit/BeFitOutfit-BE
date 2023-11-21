# -BE-BeFitOutfit

# JANGAN LUPA NGEPULL DULU SEBELUM PUSH

# Ini adalah repositori project dari aplikasi BeFitOutfit
Link documentation : https://documenter.getpostman.com/view/24013047/2s9YXmYffn

Tutorial Penggunaan:
1. Clone Repository
2. Install node module dengan perintah npm installl
3. Buat database dengan nama "percobaan"
4. Atur host database dengan cara membuat file env
    DATABASE_URL="mysql://root:${PASSWORD_DATABASE}@localhost:3306(port database kalian)/percobaan"
5. Melakukan migrate dengan cara menulis perintah npx prisma migrate
6. Lakukan pengujian pada Postman berdasarkan dokumentasi yang telah tersedia
