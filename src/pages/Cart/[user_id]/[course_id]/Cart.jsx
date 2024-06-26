import "./Cart.css";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { Header, Footer, Button } from "../../../../components";
import { Modal } from "../../../../modules/Modal";
import { payment, user, service } from "../../../../store";
import exampleImage from "../../../../images/example.png"

const widgetClientKey = process.env.REACT_APP_TOSS_PAYMENTS_CLIENT_KEY;

export const Cart = () => {
  const [paymentWidget, setPaymentWidget] = useState(null);
  const [customerKey, setCustomerKey] = useState(null);
  const [orderNumber, setOrderNumber] = useState('');
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const createPayment = payment((state) => state.createPayment);
  const userData = user((state) => state.profile);
  const getUser = user((state) => state.getUser);
  const isUserLoading = user((state) => state.isLoading);
  const data = sessionStorage.getItem("auth-storage");
  const navigate = useNavigate();
  let { course_id } = useParams();
  const isServiceLoading = service((state) => state.isLoading);
  const getService = service((state) => state.getService);
  const course = service((state) => state.course) || null;
  const myUserId = data ? JSON.parse(data).state?.user?.userId : null;
  const orderNumberGenerated = useRef(false);

  const removeHyphensFromPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/-/g, '');
  };

  const generateOrderNumber = (courseId) => {
    const today = new Date();
    const yy = String(today.getFullYear()).slice(2);
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yy}${mm}${dd}`;

    const courseIdStr = String(courseId).padStart(3, '0');
    const randomNum = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    
    return `${dateStr}${courseIdStr}${randomNum}`;
  };

  useEffect(() => {
    if (!orderNumberGenerated.current && course_id) {
      const newOrderNumber = generateOrderNumber(course_id);
      setOrderNumber(newOrderNumber);
      orderNumberGenerated.current = true;
    }
  }, [course_id]);

  useEffect(() => {
    getService(course_id);
  }, [course_id, getService]);

  useEffect(()=> {
    if(!myUserId){
      alert("로그인 후 결제가 가능합니다")
      navigate("/signin")
    } else if(!userData){
      getUser(myUserId);
    }
    setCustomerKey(userData?.uuid)
  }, [data, userData, myUserId, getUser, navigate]);

  useEffect(() => {
    const fetchPaymentWidget = async () => {
      try {
        const loadedWidget = await loadPaymentWidget(
          widgetClientKey,
          customerKey
        );
        setPaymentWidget(loadedWidget);
      } catch (error) {
        console.error("Error requesting payment:", error);
      }
    };

    if (customerKey) {
      fetchPaymentWidget();
    }
  }, [customerKey]);

  useEffect(() => {
    if (paymentWidget && price > 0) {
      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        "#payment-widget",
        { value: price },
        { variantKey: "DEFAULT" }
      );

      paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

      paymentMethodsWidgetRef.current = paymentMethodsWidget;
    }
  }, [paymentWidget, price]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget && price > 0) {
      paymentMethodsWidget.updateAmount(price);
    }
  }, [price]);

  useEffect(() => {
    if (course?.discounted_price) {
      setPrice(Number(course.discounted_price));
    }
  }, [course]);

  const handlePaymentRequest = async (orderId, serviceName, name, email, phone, amount, userId, courseId) => {
    try {
      if (!course?.category?.name) {
        throw new Error("카테고리 정보가 없습니다. 관리자에게 문의해주세요.");
      }
  
      const success = await createPayment(
        orderId, 
        amount, 
        Number(userId), 
        Number(courseId), 
        serviceName, 
        course.category.name
      );
      
      if (success) {
        await paymentWidget?.requestPayment({
          orderId: orderId,
          orderName: serviceName,
          customerName: name,
          customerEmail: email,
          customerMobilePhone: removeHyphensFromPhoneNumber(phone),
          successUrl: `${process.env.REACT_APP_CLIENT_URL}/cart/${userId}/${courseId}/success`,
          failUrl: `${process.env.REACT_APP_CLIENT_URL}/cart/${userId}/${courseId}/fail`,
        });
      } else {
        console.log("Payment creation failed");
      }
    } catch (error) {
      setErrorMessage(`결제 오류 ${error}`);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Header />
      <main className="cart-background">
        <div className="cart-info-wrap">
          {isServiceLoading ? 
            <section className="cart-info-course">
              <h3 className="cart-label">주문상품 정보</h3>
              <div className="cart-info-course-content-wrap">
                <div className="cart-course-image-wrap">
                  <div className="course-image-skeleton">
                  </div>
                </div>
                <div className="cart-info-course-content">
                  <div className="cart-info-payment-number-wrap">
                    <p className="cart-info-payment-number-label">주문번호</p>
                    <p className="course-order-id-skeleton"></p>
                  </div>
                  <p className="cart-info-course-label">상품명:</p>
                  <div className="cart-info-course-wrap">
                    <p className="course-title-skeleton"></p>
                    <p className="course-price-skeleton"></p>
                  </div>
                </div>
              </div>
            </section>
          :
          <section className="cart-info-course">
            <h3 className="cart-label">주문상품 정보</h3>
            <div className="cart-info-course-content-wrap">
              <div className="cart-course-image-wrap">
                <img
                  className="cart-course-image"
                  src={exampleImage}
                  alt="강의 썸네일"
                />
              </div>
              <div className="cart-info-course-content">
                <div className="cart-info-payment-number-wrap">
                  <p className="cart-info-payment-number-label">주문번호</p>
                  <p className="cart-info-payment-number">{orderNumber}</p>
                </div>
                <p className="cart-info-course-label">상품명:</p>
                <div className="cart-info-course-wrap">
                  <p>{course?.title}</p>
                  <p>{course?.discounted_price.toLocaleString()}원</p>
                </div>
              </div>
            </div>
          </section>
          }
          <section className="cart-info-user">
            <div className="cart-info-label-wrap">
              <h3 className="cart-label">주문자 정보</h3>
              <Button
                label="수정"
                style={{
                  width: "52px",
                  height: "36px",
                  backgroundColor: "#171A1F",
                  fontSize: "14px",
                }}
              />
            </div>
            {isUserLoading ? (
              <>
                <div className="cart-info-user-content">
                  <p className="cart-info-user-label">이름:</p>
                  <div className="course-user-name-skeleton"></div>
                </div>
                <div className="course-user-tel-skeleton"></div>
                <div className="course-user-email-skeleton"></div>
              </>
            ) : (
              <>
                <div className="cart-info-user-content">
                  <p className="cart-info-user-label">이름:</p>
                  <div className="cart-info-user-wrap">{userData?.name}</div>
                </div>
                <div className="cart-info-user-tel">{userData?.phone}</div>
                <div className="cart-info-user-email">{userData?.email}</div>
              </>
            )}
          </section>
          <div id="payment-widget" />
          <div id="agreement" />
        </div>
        <div className="cart-receipt-wrap">
          <section className="cart-receipt">
          {isServiceLoading ? (
            <>
              <h3 className="cart-label">최종결제금액</h3>
              <div className="cart-receipt-price">
                <p>상품가격</p>
                <p className="course-cost-skeleton"></p>
              </div>
              <div className="cart-receipt-discount">
                <p>할인</p>
                <p className="course-discount-skeleton"></p>
              </div>
              <div className="cart-receipt-total-price">
                <p>총결제금액</p>
                <p className="course-total-price-skeleton"></p>
              </div>
            </>
          ) : (
            <>
              <h3 className="cart-label">최종결제금액</h3>
              <div className="cart-receipt-price">
                <p>상품가격</p>
                <p>{course?.price.toLocaleString()}원</p>
              </div>
              <div className="cart-receipt-discount">
                <p>할인</p>
                <p>- {(Number(course?.price) - Number(course?.discounted_price)).toLocaleString()}원</p>
              </div>
              <div className="cart-receipt-total-price">
                <p>총결제금액</p>
                <p>{course?.discounted_price.toLocaleString()}원</p>
              </div>
            </>
          )}
          </section>
          <Button
            label="결제하기"
            variant="primary"
            size="full"
            style={{ height: "52px" }}
            onClick={()=>handlePaymentRequest(orderNumber, course?.title, userData?.name, userData?.email, userData?.phone, Number(course?.discounted_price), userData?.id, course_id)}
          />
        </div>
        <Modal
          modalTitle="결제오류"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <p>{errorMessage}</p>
        </Modal>
      </main>
      <Footer />
    </>
  );
};
