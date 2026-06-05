import json
import os
import smtplib
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет отзыв пользователя на почту администратора."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip() or 'Аноним'
    email = body.get('email', '').strip() or 'не указан'
    message = body.get('message', '').strip()

    if not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Сообщение не может быть пустым'})
        }

    smtp_host = os.environ.get('SMTP_HOST', 'smtp.mail.ru')
    smtp_port = int(os.environ.get('SMTP_PORT', '465'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    to_email = 'ivan.kochnev.2019@list.ru'

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новый отзыв от {name}'
    msg['From'] = smtp_user
    msg['To'] = to_email

    html = f"""
    <html><body style="font-family: Arial, sans-serif; color: #333;">
      <h2>Новый отзыв с сайта</h2>
      <p><b>Имя:</b> {name}</p>
      <p><b>Email:</b> {email}</p>
      <hr>
      <p><b>Сообщение:</b></p>
      <p style="white-space: pre-wrap;">{message}</p>
    </body></html>
    """
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    user_b64 = base64.b64encode(smtp_user.encode('utf-8')).decode('ascii')
    pass_b64 = base64.b64encode(smtp_password.encode('utf-8')).decode('ascii')

    server = smtplib.SMTP_SSL(smtp_host, smtp_port)
    server.ehlo()
    server.docmd('AUTH', f'LOGIN {user_b64}')
    server.docmd(pass_b64)
    server.sendmail(smtp_user, to_email, msg.as_bytes())
    server.quit()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }
