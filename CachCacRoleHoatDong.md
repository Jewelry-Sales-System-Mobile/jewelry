# Cách các role hoạt động

Hệ thống bán hàng jewelry có 2 role:

- Manager
- Staff

## Manager

### Mô tả

Manager có thể quản lý các sản phẩm, quầy, nhân viên và khách hàng

### Quyền hạn

Manager có các quyền hạn sau đây:

- Quản lý giá vàng: có thể thay đổi giá bán và giá mua, hiện tại chỉ thay đổi được giá bán.
- Quản lý sản phẩm:
  - Tạo sản phẩm -> Body gửi đi là { gemCost, name, weight } (gemCost tự nhập tay, tự suy nghĩ ra giá), Hệ thống sẽ tự động tính các thông số còn lại như sau:
    - const goldPrice = await goldPricesServices.getGoldPrices();
    - (Lấy giá vàng hiện tại từ dịch vụ)
    - const goldPricePerTeil = goldPrice?.sell_price;
    - (Giá 1 cây vàng)
    - const teil = weight / ONE_TEIL_GOLD;
    - (Tính số cây vàng "1 cây vàng là 37.5gram")
    - const laborCost = teil x LABOR_COST x (goldPricePerTeil as number);
    - (Tính được ra công làm)
    - basePrice: ((goldPricePerTeil as number) x teil) + laborCost + gemCost
    - (Tính được ra giá bán trả về)
  - Khi manager gọi api chỉnh sửa giá vàng (giá bán), laborCost và basePrice của Product sẽ tự động được tính toán và cập nhật lại bởi hệ thống.
  - Chỉnh sửa sản phẩm body y hệt create.
  - Active và InActive sản phẩm.
- Quản lý quầy:
  - Manager chỉ cần nhập tên quầy mới, hệ thống sẽ tự động điền các thông tin còn lại.
  - Get All, Get Counter By Id.
  - Xoá quầy.
  - Về chỉnh sửa thông tin quầy có thể thay đổi tên. (update counter name)
  - Add nhân viên mới vào quầy hoặc xoá nhân viên khỏi quầy (assign || unassign)
- Quản lý nhân viên:
  - Tạo tài khoản cho nhân viên mới:
    - body : {name: string;
      email: string;
      password: string;
      confirm_password: string;}
  - Active và UnActive User.
  - Add nhân viên mới vào quầy hoặc xoá nhân viên khỏi quầy (assign || unassign).
- Quản lý khách hàng:
  - Xem thông tin khách hàng.
  - Có thể sửa thông tin.

## Staff

- Quản lý đơn hàng:

  - Tạo đơn hàng mới.
  - Chuyển trạng thái đơn hàng (Đã thanh toán, Huỷ)

- Quản lý khách hàng:
  - Xem thông tin khách hàng.
  - Nếu tạo đơn hàng mới mà trong list khách hàng (Tìm bằng sđt xử lí trên fe) không tìm thấy khách hàng, có thể tạo mới và sửa thông tin.
