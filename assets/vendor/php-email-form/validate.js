
  (function () {
    "use strict";
    $("input[name='phone']").inputmask("(99) 99999-9999");
    
    // Máscara para o campo de email
    $("input[name='email']").inputmask({
        alias: "email",
        placeholder: "_"
    });

    let forms = document.querySelectorAll('.php-email-form');

    forms.forEach(function (e) {
      e.addEventListener('submit', function (event) {
        event.preventDefault();
  
        let thisForm = this;
        let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
  
  
        let recaptchaResponse = grecaptcha.getResponse();
  
        if (!recaptchaResponse) {
          displayError(thisForm, 'Confirme que não é um robo.');
          return;
        }
  
        thisForm.querySelector('.loading').classList.add('d-block');
        thisForm.querySelector('.error-message').classList.remove('d-block');
        thisForm.querySelector('.sent-message').classList.remove('d-block');
  
        let formData = new FormData(thisForm);
        formData.append('recaptcha-response', recaptchaResponse);
  
        emailjs.init("4OxBeNYeQ8tF1jMPl");  // Replace with your public key
  
        emailjs.send("GmailService", "template_pkbg55q", {
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          message: formData.get('message'),
          'g-recaptcha-response': recaptchaResponse
        }).then(() => {
          thisForm.querySelector('.loading').classList.remove('d-block');
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
          grecaptcha.reset(); // Reset reCAPTCHA
        }).catch((error) => {
          console.error('EmailJS error:', error);
          displayError(thisForm, 'Failed to send the email. Please try again later.');
        });
      });
    });
    // Função de validação personalizada com mensagens de erro visuais
    function validateForm(thisForm, name, email, phone, message) {
      let valid = true;
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const phonePattern = /^(?:(?:\+|00)55\s?)?(?:\(?[1-9][0-9]\)?\s?)?(?:9[0-9]{4}-?[0-9]{4}|[0-9]{4}-?[0-9]{4})$/;

      if (name === "") {
        displayFieldError(thisForm, 'name', 'Por favor, prrencha seu nome.');
        valid = false;
      }

      if (!emailPattern.test(email)) {
        displayFieldError(thisForm, 'email', 'Por favor, insira um email valido.');
        valid = false;
      }

      if (!phonePattern.test(phone)) {
        displayFieldError(thisForm, 'phone', 'Por favor, insira um telefone de contato valido.');
        valid = false;
      }

      if (message === "") {
        displayFieldError(thisForm, 'message', 'Por favor, explique o motivo do contato');
        valid = false;
      }

      return valid;
    }

    // Função para exibir mensagens de erro ao lado de cada campo
    function displayFieldError(thisForm, fieldName, errorMessage) {
      let errorElement = thisForm.querySelector('.error-message-' + fieldName);
      errorElement.innerHTML = errorMessage;
      errorElement.classList.add('d-block');
    }

    function displayError(thisForm, error) {
      thisForm.querySelector('.loading').classList.remove('d-block');
      thisForm.querySelector('.error-message').innerHTML = error;
      thisForm.querySelector('.error-message').classList.add('d-block');
      
      // Limpa as mensagens de erro após 30 segundos
      setTimeout(() => {
        clearErrorMessages(thisForm);
      }, 30000); // 30000 milissegundos = 30 segundos
    }
  
    function clearErrorMessages(thisForm) {
      thisForm.querySelectorAll('.error-message').forEach(function(el) {
        el.classList.remove('d-block');
        el.innerHTML = '';
      });
    }

  })();