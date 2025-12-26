"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching order:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-xl font-semibold text-gray-900">Đang tải...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-12">
          <div className="text-center mb-8">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Đặt hàng thành công!
          </h1>
            <p className="text-gray-600 mb-4">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn trong thời gian
            sớm nhất để xác nhận đơn hàng.
          </p>
            {order && (
              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Mã đơn hàng:</p>
                <p className="text-lg font-bold text-primary-600">{order.id}</p>
              </div>
            )}
          </div>

          {order && (
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Chi tiết đơn hàng
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tên khách hàng:</span>
                  <span className="font-medium">{order.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số điện thoại:</span>
                  <span className="font-medium">{order.phone}</span>
                </div>
                {order.email && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{order.email}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Địa chỉ:</span>
                  <span className="font-medium text-right max-w-xs">{order.address}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phương thức thanh toán:</span>
                  <span className="font-medium">
                    {order.paymentMethod === "cod"
                      ? "Thanh toán khi nhận hàng"
                      : "Chuyển khoản ngân hàng"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span
                    className={`font-medium ${
                      order.status === "pending"
                        ? "text-yellow-600"
                        : order.status === "confirmed"
                        ? "text-blue-600"
                        : order.status === "completed"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {order.status === "pending"
                      ? "Đang chờ xử lý"
                      : order.status === "confirmed"
                      ? "Đã xác nhận"
                      : order.status === "shipping"
                      ? "Đang giao hàng"
                      : order.status === "completed"
                      ? "Hoàn thành"
                      : "Đã hủy"}
                  </span>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 text-gray-900">Sản phẩm:</h3>
                  <div className="space-y-2">
                    {order.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm py-2 border-b"
                      >
                        <span className="text-gray-700">
                          {item.product?.name || "Sản phẩm đã bị xóa"} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Tổng cộng:
                    </span>
                    <span className="text-xl font-bold text-primary-600">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 space-y-4 text-center">
            <Link
              href="/"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
            <div>
              <Link
                href="/contact"
                className="text-primary-600 hover:underline"
              >
                Liên hệ hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-xl font-semibold text-gray-900">Đang tải...</div>
          </div>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

