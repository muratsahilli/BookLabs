# Proje Adı: BookLabs

## Amaç

Bu proje, kitapların ve yazarların stok takibini kolaylaştırmak için bir web uygulaması oluşturmayı amaçlamaktadır.

## Kullanılan Teknolojiler

### Front-end
- React JS  *18.2.0*
- React Bootstrap  *2.7.2*
- React Data Table Component  *7.5.3*
- React Router Dom  *6.9.0*
- React Select  *5.7.2*
- Axios  *1.3.4*
- Font Awesome   *6.4.0*

### Back-end
- ASP.NET Core  *6.0*
- Entity Framework Core  *7.0.5*
- Npgsql  *7.0.2*

### Test
- XUnit  *2.4.1*
- Microsoft .NET Test SDK  *17.1.0*
- Entity Framework Core InMemory  *7.0.5*

### Veri tabanı
- PostgreSQL *14*

## Veri tabanı Tasarımı

- Book (kitap) tablosu: BookId (int), Title (string), TotalPages (id), PublishedDate (DateTime)
- Author (yazar) tablosu: AuthorId (int), AuthorName (string), BirthDate (DateTime)
- BookAuthor (kitap-yazar ilişkisi) tablosu: bookId (int), authorId (int)
- User (kullanıcı) tablosu: UserId (int), UserName (string), FullName (string), Email (string), Password (string)
- UserRole (kullanıcı-rol ilişkisi) tablosu: userId (int), roleId (int)
- Role (rol) tablosu: RoleId (int), RoleName (string)

## API Endpoint'leri

- GET /books: Tüm kitapları listeler
- GET /books/{id}: Belirli bir kitabı getirir
- GET /books/counter: Kitap sayısını getirir
- POST /books: Yeni bir kitap ekler
- PUT /books/{id}: Belirli bir kitabı günceller
- DELETE /books/{id}: Belirli bir kitabı siler
- GET /authors: Tüm yazarları listeler
- GET /authors/{id}: Belirli bir yazarı getirir
- GET /authors/counter: Yazar sayısını getirir
- POST /authors: Yeni bir yazar ekler
- PUT /authors/{id}: Belirli bir yazarı günceller
- DELETE /authors/{id}: Belirli bir yazarı siler
- GET /users: Tüm kullanıcıları listeler
- GET /users/{id}: Belirli bir kullanıcıyı getirir
- GET /users/counter: Kullanıcı sayısını getirir
- POST /users: Yeni bir kullanıcı ekler
- POST /users/login: Kullanıcıya giriş yaptırır
- PUT /users/{id}: Belirli bir kullanıcıyı günceller
- PUT /users/role/{id}: Belirli bir kullanıcının rolünü değiştirir
- DELETE /users/{id}: Belirli bir kullanıcıyı siler

## Kullanıcı Yetkileri

- Admin: Tüm endpoint'lere erişebilir ve tüm CRUD işlemlerini yapabilir.
- Kullanıcı: Sadece kitapları ve yazarları listeleyebilir ve sistemde kayıtlı kitap, yazar ve kullanıcı sayılarını görebilir .

## Front-End

- Sistemde kayıtlı kitap, yazar ve kullanıcı sayılarını gösteren bir ana sayfa
- Kitapları listeleyen bir sayfa
- Kitap eklemek için bir form
- Kitap güncellemek için bir form
- Yazarları listeleyen bir sayfa
- Yazar eklemek için bir form
- Yazar güncellemek için bir form
- Kullanıcıları listeleyen bir sayfa
- Kullanıcı güncellemek için bir form
- Kullanıcı girişi için bir sayfa
- Kullanıcı kayıt için bir sayfa

## Testler 
### Kitap Testleri
Bu testler, kitapların listelenmesi, kitap bilgilerinin güncellemesi ve silinmesi gibi temel işlevlerin doğru bir şekilde çalıştığını doğrulamayı amaçlıyor.

- **GetBook_ReturnCorrectBook**: Doğru kitabın getirildiğini doğruluyor.

- **GetBook_WithInvalidId_ReturnsNotFound**: Mevcut olmayan bir kitap için getirme işlevi çağrıldığında bir hata kodu döndürdüğünü doğruluyor.

- **GetBooks_ReturnsListOfBooks**: Tüm kitapların doğru bir şekilde getirildiğini doğruluyor.

- **GetBooksCount_ReturnsCorrectCount**: Kitap sayısının doğru bir şekilde getirildiğini doğruluyor.

- **PostBook_ShouldAddBookAndAuthors**: Kitabın yazarlarıyla birlikte doğru bir şekilde eklendiğini doğruluyor.

- **PostBook_ShouldReturnBadRequest_WhenBookIsNull**: Bir kitabın null olarak gönderilmesi durumunda doğru bir hata kodunun döndürüldüğünü doğruluyor.

- **PutBook_ShouldChangeBookInformation**: Bir kitabın bilgilerinin doğru bir şekilde güncellendiğini doğruluyor.

- **DeleteBook_ReturnsNoContentResult**: Bir kitabın silme işlevinin doğru bir şekilde çalıştığını doğruluyor.

### Yazar Testleri
Bu testler, yazarların listelenmesi, yazar bilgilerinin güncellemesi ve silinmesi gibi temel işlevlerin doğru bir şekilde çalıştığını doğrulamayı amaçlıyor.

- **GetAuthor_ReturnCorrectAuthor**: Doğru yazarın getirildiği

- **GetAuthor_WithInvalidId_ReturnsNull**: Mevcut olmayan bir yazar için getirme işlevi çağrıldığında bir hata kodu döndürdüğünü doğruluyor.

- **GetAuthors_ReturnsListOfAuthors**: Tüm kitapların doğru bir şekilde getirildiğini doğruluyor.

- **GetAuthorsCount_ReturnsCorrectCount**: Yazar sayısının doğru bir şekilde getirildiğini doğruluyor.

- **PostAuthor_ShouldAddAuthor**: Yazarın doğru bir şekilde eklendiğini doğruluyor.

- **PostAuthor_ShouldReturnBadRequest_WhenAuthorIsNull**: Bir yazarın null olarak gönderilmesi durumunda doğru bir hata kodunun döndürüldüğünü doğruluyor.

- **PutAuthor_ShouldReturnBadRequestResult_WhenAuthorIdDoesNotMatch**: Güncellenecek yazarın kimlik bilgisinin yanlış olması durumunda doğru bir hata kodunun döndürüldüğünü doğruluyor.

- **PutAuthor_ShouldReturnNoContentResult_WhenAuthorIsUpdated**:Bir yazarın bilgilerinin doğru bir şekilde güncellendiğini doğruluyor.

- **DeleteAuthor_ReturnsNoContentResult**: Bir yazarın silme işlevinin doğru bir şekilde çalıştığını doğruluyor.

### Kullanıcı Testleri
Bu testler, kullanıcının kaydolması, giriş yapması, kullanıcı bilgilerinin güncellenmesi ve kullanıcının silinmesi gibi temel işlevlerin doğru bir şekilde çalıştığını doğrulamayı amaçlıyor.

- **GetUser_ReturnCorrectUser**: Doğru kullanıcının getirildiğini doğruluyor.

- **GetUserCount_ReturnsCorrectCount**: Kullanıcı sayısının doğru bir şekilde getirildiğini doğruluyor.

- **GetUsers_ReturnListOfUsers**: Tüm kullanıcıların doğru bir şekilde getirildiğini doğruluyor.

- **Login_WithInvalidCredentials_ReturnsBadRequest**: Geçersiz kimlik bilgileriyle giriş yapılırsa doğru bir hata kodu döndürdüğünü doğruluyor.

- **Login_WithValidCredentials_ReturnsCurrentUser**: Doğru kimlik bilgileriyle giriş yapılırsa doğru kullanıcının getirildiğini doğruluyor.

- **PostUser_ReturnsConflictError_WhenEmailAlreadyExists**: Aynı e-posta adresiyle kayıtlı bir kullanıcı varsa doğru bir hata kodu döndürdüğünü doğruluyor.

- **PostUser_ReturnsConflictError_WhenUsernameAlreadyExists**: Aynı kullanıcı adıyla kayıtlı bir kullanıcı varsa doğru bir hata kodu döndürdüğünü doğruluyor.

- **PostUser_ShouldRegisterUserWithRole**: Bir kullanıcının rolüyle birlikte doğru bir şekilde kaydedildiğini doğruluyor.

- **PutUser_WithMatchingId_ReturnsNoContent**: Kullanıcının güncelleme işlevinin doğru bir şekilde çalıştığını doğruluyor.

- **PutUser_WithNonExistingId_ReturnsNotFound**: Mevcut olmayan bir kullanıcı için güncelleme işlevi çağrıldığında doğru bir hata kodu döndürdüğünü doğruluyor.

- **PutUser_WithUnmatchedId_ReturnsBadRequest**: Güncellenecek kullanıcının kimlik bilgisinin yanlış olması durumunda doğru bir hata kodu döndürdüğünü doğruluyor.

- **DeleteUser_ReturnsNoContentResult**: Bir kullanıcının silme işlevinin doğru bir şekilde çalıştığını doğruluyor.
