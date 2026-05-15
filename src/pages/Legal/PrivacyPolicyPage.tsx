import LegalLayout from './LegalLayout'

function Section({ number, title, children }: { number?: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg md:text-xl font-bold text-white mb-4 flex items-start gap-2.5">
        {number && <span className="text-brand-400 font-black flex-shrink-0">{number}.</span>}
        <span>{title}</span>
      </h2>
      <div className="space-y-3 pl-0">{children}</div>
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-2.5">{title}</h3>
      {children}
    </div>
  )
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-400 text-sm leading-relaxed">{children}</p>
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-400">
          <span className="w-1 h-1 rounded-full bg-brand-500 flex-shrink-0 mt-2" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Política de Privacidad" lastUpdated="Última actualización: 14 de mayo de 2026">

      <Body>
        Bienvenido a Ubyca. La presente Política de Privacidad regula la recopilación, uso, almacenamiento
        y protección de los datos personales de los usuarios que utilizan la plataforma Ubyca (la "Plataforma"),
        operada por Ubyca.
      </Body>
      <Body>
        Al acceder o utilizar la Plataforma, aceptas las prácticas descritas en esta Política de Privacidad.
      </Body>

      <Section number="1" title="Información que recopilamos">
        <Body>Ubyca puede recopilar las siguientes categorías de información:</Body>

        <SubSection title="1.1 Información proporcionada directamente por el usuario">
          <BulletList items={[
            'Nombre y apellido',
            'Dirección de correo electrónico',
            'Nombre de empresa',
            'Contraseña de acceso',
            'Información de facturación',
            'Contenido cargado por el usuario',
            'URLs, coordenadas geográficas, imágenes, textos y archivos asociados a proyectos',
          ]} />
        </SubSection>

        <SubSection title="1.2 Información recopilada automáticamente">
          <BulletList items={[
            'Dirección IP',
            'Tipo de navegador y dispositivo',
            'Sistema operativo',
            'Datos de navegación',
            'Fecha y hora de acceso',
            'Información de geolocalización',
            'Eventos de interacción con experiencias geolocalizadas',
          ]} />
        </SubSection>

        <SubSection title="1.3 Información de terceros">
          <Body>
            Podemos recibir información desde servicios de terceros utilizados para autenticación, pagos,
            analítica o integración tecnológica.
          </Body>
        </SubSection>
      </Section>

      <Section number="2" title="Finalidad del tratamiento de datos">
        <Body>Utilizamos la información recopilada para:</Body>
        <BulletList items={[
          'Proveer y operar la Plataforma',
          'Crear y administrar cuentas de usuario',
          'Permitir la creación de experiencias geolocalizadas',
          'Gestionar proyectos, métricas y funcionalidades asociadas',
          'Verificar acceso geográfico a contenidos',
          'Mejorar el rendimiento y estabilidad de la Plataforma',
          'Brindar soporte técnico',
          'Prevenir fraudes, abusos y accesos no autorizados',
          'Cumplir obligaciones legales y regulatorias',
          'Enviar comunicaciones operativas o comerciales relacionadas con el servicio',
        ]} />
      </Section>

      <Section number="3" title="Geolocalización">
        <Body>
          Ubyca utiliza datos de ubicación geográfica para habilitar funcionalidades esenciales de la Plataforma.
        </Body>
        <Body>El usuario entiende y acepta que:</Body>
        <BulletList items={[
          'La precisión de ubicación depende del dispositivo, navegador, señal GPS y servicios externos.',
          'Ubyca no garantiza exactitud absoluta en los datos de geolocalización.',
          'La ubicación puede utilizarse para validar acceso a contenidos, experiencias o funcionalidades restringidas geográficamente.',
        ]} />
        <Body>
          El usuario es responsable de obtener cualquier consentimiento necesario de terceros antes de recopilar
          o utilizar datos de ubicación mediante proyectos creados en la Plataforma.
        </Body>
      </Section>

      <Section number="4" title="Compartición de información">
        <Body>Ubyca no vende datos personales a terceros.</Body>
        <Body>Podremos compartir información únicamente en los siguientes casos:</Body>
        <BulletList items={[
          'Proveedores tecnológicos necesarios para operar la Plataforma',
          'Procesadores de pago',
          'Servicios de infraestructura y almacenamiento cloud',
          'Autoridades competentes cuando exista obligación legal',
          'Procesos corporativos como fusiones, adquisiciones o reorganizaciones',
        ]} />
        <Body>
          Todos los proveedores externos deberán mantener estándares razonables de confidencialidad y seguridad.
        </Body>
      </Section>

      <Section number="5" title="Infraestructura y almacenamiento">
        <Body>
          La Plataforma puede utilizar servicios de terceros para hosting, almacenamiento, analítica y
          procesamiento, incluyendo infraestructura cloud internacional.
        </Body>
        <Body>
          Los datos pueden almacenarse y procesarse fuera del país de residencia del usuario.
        </Body>
      </Section>

      <Section number="6" title="Seguridad de la información">
        <Body>
          Ubyca implementa medidas técnicas y organizativas razonables para proteger la información contra:
        </Body>
        <BulletList items={[
          'Acceso no autorizado',
          'Alteración',
          'Divulgación',
          'Pérdida o destrucción',
        ]} />
        <Body>
          Sin perjuicio de lo anterior, ningún sistema es completamente seguro y Ubyca no puede garantizar
          seguridad absoluta.
        </Body>
      </Section>

      <Section number="7" title="Conservación de datos">
        <Body>La información será almacenada mientras:</Body>
        <BulletList items={[
          'La cuenta permanezca activa',
          'Sea necesaria para la prestación del servicio',
          'Existan obligaciones legales aplicables',
          'Sea requerida para resolución de disputas o protección jurídica',
        ]} />
        <Body>
          Ubyca podrá eliminar cuentas o contenidos inactivos conforme a sus políticas internas.
        </Body>
      </Section>

      <Section number="8" title="Derechos del usuario">
        <Body>
          Dependiendo de la legislación aplicable, el usuario podrá solicitar:
        </Body>
        <BulletList items={[
          'Acceso a sus datos',
          'Rectificación',
          'Eliminación',
          'Limitación del tratamiento',
          'Portabilidad',
          'Oposición al tratamiento',
        ]} />
        <Body>
          Las solicitudes podrán realizarse mediante contacto oficial indicado en la Plataforma.
        </Body>
      </Section>

      <Section number="9" title="Cookies y tecnologías similares">
        <Body>Ubyca puede utilizar cookies y tecnologías equivalentes para:</Body>
        <BulletList items={[
          'Mantener sesiones activas',
          'Recordar preferencias',
          'Analizar tráfico y comportamiento',
          'Mejorar experiencia de usuario',
          'Medir rendimiento de funcionalidades',
        ]} />
        <Body>
          El usuario puede modificar la configuración de cookies desde su navegador.
        </Body>
      </Section>

      <Section number="10" title="Contenido generado por usuarios">
        <Body>El usuario es exclusivamente responsable de:</Body>
        <BulletList items={[
          'Los contenidos cargados en la Plataforma',
          'La legalidad de dichos contenidos',
          'Los permisos necesarios sobre imágenes, marcas, ubicaciones o materiales utilizados',
        ]} />
        <Body>
          Ubyca no revisa previamente todo el contenido generado por usuarios y podrá eliminar contenido
          que infrinja la ley o estos términos.
        </Body>
      </Section>

      <Section number="11" title="Modificaciones">
        <Body>
          Ubyca podrá modificar esta Política de Privacidad en cualquier momento.
        </Body>
        <Body>
          Las modificaciones entrarán en vigencia desde su publicación en la Plataforma.
        </Body>
      </Section>

      <Section number="12" title="Contacto">
        <Body>Para consultas relacionadas con privacidad o tratamiento de datos:</Body>
        <div className="mt-3">
          <a
            href="mailto:contacto@ubyca.com"
            className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            contacto@ubyca.com
          </a>
        </div>
      </Section>

    </LegalLayout>
  )
}
