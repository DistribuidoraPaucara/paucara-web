<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error 500 - Error Interno del Servidor</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .error-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 100%;
            padding: 40px;
            text-align: center;
        }

        .error-code {
            font-size: 120px;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 20px;
            line-height: 1;
        }

        .error-title {
            font-size: 28px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 16px;
        }

        .error-message {
            font-size: 16px;
            color: #4a5568;
            line-height: 1.6;
            margin-bottom: 32px;
        }

        .error-details {
            background: #f7fafc;
            border-left: 4px solid #fc8181;
            padding: 16px;
            margin-bottom: 32px;
            text-align: left;
            border-radius: 4px;
        }

        .error-details h3 {
            font-size: 14px;
            font-weight: 600;
            color: #c53030;
            margin-bottom: 8px;
        }

        .error-details p {
            font-size: 13px;
            color: #2d3748;
            font-family: 'Courier New', monospace;
            word-break: break-word;
        }

        .button-group {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            transition: all 0.2s;
            border: none;
            cursor: pointer;
            font-size: 14px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: #e2e8f0;
            color: #4a5568;
        }

        .btn-secondary:hover {
            background: #cbd5e0;
        }

        @media (max-width: 480px) {
            .error-code {
                font-size: 80px;
            }

            .error-title {
                font-size: 24px;
            }

            .button-group {
                flex-direction: column;
            }

            .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-code">500</div>
        <h1 class="error-title">Error Interno del Servidor</h1>
        <p class="error-message">
            Lo sentimos, algo salió mal en el servidor. Nuestro equipo ha sido notificado y está trabajando para resolver el problema.
        </p>

        @if(isset($message) && config('app.debug'))
        <div class="error-details">
            <h3>Detalles del Error:</h3>
            <p>{{ $message }}</p>
        </div>
        @endif

        <div class="button-group">
            <a href="javascript:history.back()" class="btn btn-secondary">
                ← Volver
            </a>
            <a href="/" class="btn btn-primary">
                Ir al Inicio
            </a>
        </div>
    </div>
</body>
</html>
