import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  newPassword: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  newPassword,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', color: '#222' }}>
    <h2>Xin chào {firstName},</h2>
    <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
    <p>
      <b>Mật khẩu mới của bạn là:</b>
      <br />
      <span style={{ fontSize: 18, color: '#309689', fontWeight: 600 }}>{newPassword}</span>
    </p>
    <p>Hãy sử dụng mật khẩu này để đăng nhập và đổi lại mật khẩu nếu muốn.</p>
    <p>
      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.<br />
      Trân trọng,<br />
      Đội ngũ hỗ trợ
    </p>
  </div>
);