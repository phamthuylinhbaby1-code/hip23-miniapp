console.log("app.js đang hoạt động");

document.addEventListener("DOMContentLoaded", () => {
    // =====================================================
    // PHẦN TỬ GIAO DIỆN
    // =====================================================

    const authSection =
        document.getElementById("authSection");

    const dashboardSection =
        document.getElementById("dashboardSection");

    const orderSection =
        document.getElementById("orderSection");

    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById("registerForm");

    const orderForm =
        document.getElementById("orderForm");

    const loginTabButton =
        document.getElementById("loginTabButton");

    const registerTabButton =
        document.getElementById("registerTabButton");

    const logoutButton =
        document.getElementById("logoutButton");

    const openOrderButton =
        document.getElementById("openOrderButton");

    const backToDashboardButton =
        document.getElementById("backToDashboardButton");

    const authMessage =
        document.getElementById("authMessage");

    const orderMessage =
        document.getElementById("orderMessage");

    const userDisplayName =
        document.getElementById("userDisplayName");

    const userBalance =
        document.getElementById("userBalance");

    const userUsername =
        document.getElementById("userUsername");

    const userEmail =
        document.getElementById("userEmail");

    const userRole =
        document.getElementById("userRole");

    const userCreatedAt =
        document.getElementById("userCreatedAt");

    const serviceSelect =
        document.getElementById("serviceSelect");

    const serviceDetails =
        document.getElementById("serviceDetails");

    const servicePlatform =
        document.getElementById("servicePlatform");

    const serviceCategory =
        document.getElementById("serviceCategory");

    const servicePrice =
        document.getElementById("servicePrice");

    const serviceMin =
        document.getElementById("serviceMin");

    const serviceMax =
        document.getElementById("serviceMax");

    const orderLink =
        document.getElementById("orderLink");

    const orderQuantity =
        document.getElementById("orderQuantity");

    const orderTotal =
        document.getElementById("orderTotal");

    let services = [];
    let currentUser = null;

    // =====================================================
    // TELEGRAM MINI APP
    // =====================================================

    const telegram =
        window.Telegram?.WebApp;

    if (telegram) {
        telegram.ready();
        telegram.expand();
    }

    // =====================================================
    // HÀM GỌI API
    // =====================================================

    async function apiRequest(url, options = {}) {
        const response = await fetch(url, {
            method: options.method || "GET",

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },

            body: options.body
                ? JSON.stringify(options.body)
                : undefined,

            credentials: "include"
        });

        let result;

        try {
            result = await response.json();
        } catch (error) {
            throw new Error(
                "Máy chủ trả về dữ liệu không hợp lệ."
            );
        }

        if (!response.ok) {
            throw new Error(
                result.message ||
                "Yêu cầu không thành công."
            );
        }

        return result;
    }

    // =====================================================
    // HÀM THÔNG BÁO
    // =====================================================

    function showAuthMessage(
        message,
        type = "error"
    ) {
        if (!authMessage) {
            return;
        }

        authMessage.textContent = message;
        authMessage.className =
            `message ${type}`;
    }

    function hideAuthMessage() {
        if (!authMessage) {
            return;
        }

        authMessage.textContent = "";
        authMessage.className =
            "message hidden";
    }

    function showOrderMessage(
        message,
        type = "error"
    ) {
        if (!orderMessage) {
            return;
        }

        orderMessage.textContent = message;
        orderMessage.className =
            `message ${type}`;
    }

    function hideOrderMessage() {
        if (!orderMessage) {
            return;
        }

        orderMessage.textContent = "";
        orderMessage.className =
            "message hidden";
    }

    // =====================================================
    // HÀM ĐỊNH DẠNG
    // =====================================================

    function formatMoney(value) {
        const amount =
            Number(value) || 0;

        return new Intl.NumberFormat(
            "vi-VN",
            {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0
            }
        ).format(amount);
    }

    function formatNumber(value) {
        return Number(value || 0)
            .toLocaleString("vi-VN");
    }

    function formatDate(value) {
        if (!value) {
            return "---";
        }

        const normalized =
            String(value).includes("T")
                ? value
                : String(value).replace(" ", "T") + "Z";

        const date =
            new Date(normalized);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleString(
            "vi-VN"
        );
    }

    // =====================================================
    // CHUYỂN TAB ĐĂNG NHẬP / ĐĂNG KÝ
    // =====================================================

    function showLoginForm() {
        hideAuthMessage();

        loginForm?.classList.remove(
            "hidden"
        );

        registerForm?.classList.add(
            "hidden"
        );

        loginTabButton?.classList.add(
            "active"
        );

        registerTabButton?.classList.remove(
            "active"
        );
    }

    function showRegisterForm() {
        hideAuthMessage();

        registerForm?.classList.remove(
            "hidden"
        );

        loginForm?.classList.add(
            "hidden"
        );

        registerTabButton?.classList.add(
            "active"
        );

        loginTabButton?.classList.remove(
            "active"
        );
    }

    // =====================================================
    // CHUYỂN MÀN HÌNH
    // =====================================================

    function showAuthScreen() {
        orderSection?.classList.add(
            "hidden"
        );

        dashboardSection?.classList.add(
            "hidden"
        );

        authSection?.classList.remove(
            "hidden"
        );

        showLoginForm();
    }

    function showDashboard(user) {
        currentUser = user;

        authSection?.classList.add(
            "hidden"
        );

        orderSection?.classList.add(
            "hidden"
        );

        dashboardSection?.classList.remove(
            "hidden"
        );

        if (userDisplayName) {
            userDisplayName.textContent =
                user.full_name ||
                user.username ||
                "Người dùng";
        }

        if (userBalance) {
            userBalance.textContent =
                formatMoney(
                    user.balance
                );
        }

        if (userUsername) {
            userUsername.textContent =
                user.username || "---";
        }

        if (userEmail) {
            userEmail.textContent =
                user.email || "---";
        }

        if (userRole) {
            userRole.textContent =
                user.role === "admin"
                    ? "Quản trị viên"
                    : "Người dùng";
        }

        if (userCreatedAt) {
            userCreatedAt.textContent =
                formatDate(
                    user.created_at
                );
        }
    }

    async function showOrderSection() {
        hideOrderMessage();

        authSection?.classList.add(
            "hidden"
        );

        dashboardSection?.classList.add(
            "hidden"
        );

        orderSection?.classList.remove(
            "hidden"
        );

        await loadServices();
    }

    function showDashboardSection() {
        orderSection?.classList.add(
            "hidden"
        );

        authSection?.classList.add(
            "hidden"
        );

        dashboardSection?.classList.remove(
            "hidden"
        );
    }

    // =====================================================
    // DỊCH VỤ
    // =====================================================

    async function loadServices() {
        if (!serviceSelect) {
            console.error(
                "Không tìm thấy serviceSelect"
            );

            return;
        }

        serviceSelect.innerHTML = `
            <option value="">
                Đang tải dịch vụ...
            </option>
        `;

        try {
            const result =
                await apiRequest(
                    "/api/services"
                );

            services =
                result.services || [];

            serviceSelect.innerHTML = `
                <option value="">
                    Chọn một dịch vụ
                </option>
            `;

            for (const service of services) {
                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    String(service.id);

                option.textContent =
                    `${service.platform} - ${service.name}`;

                serviceSelect.appendChild(
                    option
                );
            }

            if (services.length === 0) {
                serviceSelect.innerHTML = `
                    <option value="">
                        Chưa có dịch vụ
                    </option>
                `;
            }
        } catch (error) {
            console.error(
                "Lỗi tải dịch vụ:",
                error
            );

            serviceSelect.innerHTML = `
                <option value="">
                    Không tải được dịch vụ
                </option>
            `;

            showOrderMessage(
                error.message
            );
        }
    }

    function getSelectedService() {
        if (!serviceSelect) {
            return null;
        }

        const selectedId =
            Number(
                serviceSelect.value
            );

        return services.find(
            service =>
                Number(service.id) ===
                selectedId
        ) || null;
    }

    function updateServiceDetails() {
        const service =
            getSelectedService();

        if (!service) {
            serviceDetails?.classList.add(
                "hidden"
            );

            if (orderQuantity) {
                orderQuantity.value = "";
                orderQuantity.min = "1";
                orderQuantity.removeAttribute(
                    "max"
                );
            }

            if (orderTotal) {
                orderTotal.textContent =
                    "0 ₫";
            }

            return;
        }

        serviceDetails?.classList.remove(
            "hidden"
        );

        if (servicePlatform) {
            servicePlatform.textContent =
                service.platform || "---";
        }

        if (serviceCategory) {
            serviceCategory.textContent =
                service.category || "---";
        }

        if (servicePrice) {
            servicePrice.textContent =
                formatMoney(
                    service.price_per_1000
                );
        }

        if (serviceMin) {
            serviceMin.textContent =
                formatNumber(
                    service.min_quantity
                );
        }

        if (serviceMax) {
            serviceMax.textContent =
                formatNumber(
                    service.max_quantity
                );
        }

        if (orderQuantity) {
            orderQuantity.min =
                String(
                    service.min_quantity
                );

            orderQuantity.max =
                String(
                    service.max_quantity
                );

            orderQuantity.value =
                String(
                    service.min_quantity
                );
        }

        updateOrderTotal();
    }

    function updateOrderTotal() {
        const service =
            getSelectedService();

        const quantity =
            Number(
                orderQuantity?.value
            ) || 0;

        if (
            !service ||
            quantity <= 0
        ) {
            if (orderTotal) {
                orderTotal.textContent =
                    "0 ₫";
            }

            return;
        }

        const total =
            Math.ceil(
                quantity *
                Number(
                    service.price_per_1000
                ) /
                1000
            );

        if (orderTotal) {
            orderTotal.textContent =
                formatMoney(total);
        }
    }

    // =====================================================
    // KIỂM TRA PHIÊN ĐĂNG NHẬP
    // =====================================================

    async function checkCurrentUser() {
        try {
            const result =
                await apiRequest(
                    "/api/auth/me"
                );

            showDashboard(
                result.user
            );
        } catch (error) {
            showAuthScreen();
        }
    }

    // =====================================================
    // SỰ KIỆN TAB
    // =====================================================

    loginTabButton?.addEventListener(
        "click",
        showLoginForm
    );

    registerTabButton?.addEventListener(
        "click",
        showRegisterForm
    );

    // =====================================================
    // ĐĂNG KÝ
    // =====================================================

    registerForm?.addEventListener(
        "submit",
        async event => {
            event.preventDefault();
            hideAuthMessage();

            const submitButton =
                registerForm.querySelector(
                    'button[type="submit"]'
                );

            const formData =
                new FormData(
                    registerForm
                );

            const data = {
                fullName:
                    String(
                        formData.get(
                            "fullName"
                        ) || ""
                    ).trim(),

                username:
                    String(
                        formData.get(
                            "username"
                        ) || ""
                    ).trim(),

                email:
                    String(
                        formData.get(
                            "email"
                        ) || ""
                    ).trim(),

                password:
                    String(
                        formData.get(
                            "password"
                        ) || ""
                    ),

                confirmPassword:
                    String(
                        formData.get(
                            "confirmPassword"
                        ) || ""
                    )
            };

            if (
                data.password !==
                data.confirmPassword
            ) {
                showAuthMessage(
                    "Hai mật khẩu không giống nhau."
                );

                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent =
                    "Đang tạo tài khoản...";
            }

            try {
                const result =
                    await apiRequest(
                        "/api/auth/register",
                        {
                            method: "POST",
                            body: data
                        }
                    );

                registerForm.reset();

                showDashboard(
                    result.user
                );
            } catch (error) {
                showAuthMessage(
                    error.message
                );
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent =
                        "Tạo tài khoản";
                }
            }
        }
    );

    // =====================================================
    // ĐĂNG NHẬP
    // =====================================================

    loginForm?.addEventListener(
        "submit",
        async event => {
            event.preventDefault();
            hideAuthMessage();

            const submitButton =
                loginForm.querySelector(
                    'button[type="submit"]'
                );

            const formData =
                new FormData(
                    loginForm
                );

            const data = {
                account:
                    String(
                        formData.get(
                            "account"
                        ) || ""
                    ).trim(),

                password:
                    String(
                        formData.get(
                            "password"
                        ) || ""
                    )
            };

            if (
                !data.account ||
                !data.password
            ) {
                showAuthMessage(
                    "Vui lòng nhập tài khoản và mật khẩu."
                );

                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent =
                    "Đang đăng nhập...";
            }

            try {
                const result =
                    await apiRequest(
                        "/api/auth/login",
                        {
                            method: "POST",
                            body: data
                        }
                    );

                loginForm.reset();

                showDashboard(
                    result.user
                );
            } catch (error) {
                showAuthMessage(
                    error.message
                );
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent =
                        "Đăng nhập";
                }
            }
        }
    );

    // =====================================================
    // ĐĂNG XUẤT
    // =====================================================

    logoutButton?.addEventListener(
        "click",
        async () => {
            logoutButton.disabled = true;
            logoutButton.textContent =
                "Đang thoát...";

            try {
                await apiRequest(
                    "/api/auth/logout",
                    {
                        method: "POST"
                    }
                );
            } catch (error) {
                console.error(error);
            } finally {
                currentUser = null;

                logoutButton.disabled = false;
                logoutButton.textContent =
                    "Đăng xuất";

                showAuthScreen();
            }
        }
    );

    // =====================================================
    // MỞ / ĐÓNG TRANG TẠO ĐƠN
    // =====================================================

    openOrderButton?.addEventListener(
        "click",
        async () => {
            console.log(
                "Đã nhấn Tạo đơn dịch vụ"
            );

            await showOrderSection();
        }
    );

    backToDashboardButton?.addEventListener(
        "click",
        showDashboardSection
    );

    // =====================================================
    // THAY ĐỔI DỊCH VỤ VÀ SỐ LƯỢNG
    // =====================================================

    serviceSelect?.addEventListener(
        "change",
        updateServiceDetails
    );

    orderQuantity?.addEventListener(
        "input",
        updateOrderTotal
    );

    // =====================================================
    // FORM TẠO ĐƠN
    // =====================================================

    orderForm?.addEventListener(
        "submit",
        event => {
            event.preventDefault();
            hideOrderMessage();

            const service =
                getSelectedService();

            const link =
                String(
                    orderLink?.value || ""
                ).trim();

            const quantity =
                Number(
                    orderQuantity?.value
                ) || 0;

            if (!service) {
                showOrderMessage(
                    "Vui lòng chọn dịch vụ."
                );

                return;
            }

            if (!link) {
                showOrderMessage(
                    "Vui lòng nhập liên kết."
                );

                return;
            }

            if (
                quantity <
                Number(
                    service.min_quantity
                )
            ) {
                showOrderMessage(
                    `Số lượng tối thiểu là ${formatNumber(
                        service.min_quantity
                    )}.`
                );

                return;
            }

            if (
                quantity >
                Number(
                    service.max_quantity
                )
            ) {
                showOrderMessage(
                    `Số lượng tối đa là ${formatNumber(
                        service.max_quantity
                    )}.`
                );

                return;
            }

            showOrderMessage(
                "Giao diện tạo đơn đã hoạt động. Bước sau sẽ lưu đơn vào database.",
                "success"
            );
        }
    );

    // =====================================================
    // KHỞI ĐỘNG
    // =====================================================

    showAuthScreen();
    checkCurrentUser();
});