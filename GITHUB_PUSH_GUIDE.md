# 🚀 خطوات رفع المشروع على GitHub

## الخطوة 1: افتح PowerShell في مجلد المشروع

```powershell
cd "C:\Users\rakan\.verdent\verdent-projects\new-project"
```

## الخطوة 2: نفذ هذه الأوامر بالترتيب

```powershell
# حذف git القديم إذا موجود
Remove-Item -Path ".git" -Recurse -Force -ErrorAction SilentlyContinue

# تهيئة git جديد
git init

# إعداد المستخدم
git config user.email "rakanshalal@gmail.com"
git config user.name "Rakan Shalal"

# إضافة كل الملفات
git add .

# عمل commit
git commit -m "🎓 Initial commit: Matin Platform v1.0

- Clean codebase with 363 files
- 150+ dashboard pages
- 192 API endpoints
- Institution templates system
- Stripe payment integration
- Email system ready
- 11 user roles"

# ربط بالريموت
git remote add origin https://github.com/rakanshalal-wq/matin.git

# رفع الكود
git branch -M main
git push -u origin main --force
```

## ✅ بعد الرفع

ستجد المشروع هنا:
**https://github.com/rakanshalal-wq/matin**

## 🔧 لو واجهت خطأ في الـ push

جرب هذا الأمر بديل (استبدل YOUR_TOKEN بالتوكن الخاص بك):
```powershell
git push https://YOUR_TOKEN@github.com/rakanshalal-wq/matin.git main --force
```

## 📋 ملفات جديدة تم إنشاؤها

1. ✅ `README.md` - شرح المشروع
2. ✅ `src/components/institution-templates/SchoolTemplate.tsx` - قالب المدرسة
3. ✅ `src/components/institution-templates/NurseryTemplate.tsx` - قالب الحضانة
4. ✅ `src/components/institution-templates/index.ts` - تصدير القوالب

## 🎯 الخطوات القادمة بعد الرفع

1. إنشاء القوالب الباقية (4 قوالب)
2. إصلاح قاعدة البيانات
3. ربط البريد بالعمليات
4. اختبار شامل

---

**هل تبغي أكمل القوالب الباقية الآن ولا ترفع الأول؟**
