import LegalLayout from './LegalLayout'

function Section({ number, title, children }: { number?: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg md:text-xl font-bold text-white mb-4 flex items-start gap-2.5">
        {number && <span className="text-brand-400 font-black flex-shrink-0">{number}.</span>}
        <span>{title}</span>
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
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

export default function TermsAndConditionsPage() {
  return (
    <LegalLayout title="Términos y Condiciones" lastUpdated="Última actualización: 14 de mayo de 2026">

      <Body>
        Estos Términos y Condiciones regulan el acceso y uso de la plataforma Ubyca.
        Al utilizar la Plataforma, el usuario acepta íntegramente estos términos.
      </Body>

      <Section number="1" title="Descripción del servicio">
        <Body>
          Ubyca es una plataforma tecnológica que permite crear, administrar y compartir experiencias
          geolocalizadas, contenidos digitales y puntos interactivos asociados a ubicaciones físicas.
        </Body>
        <Body>La Plataforma puede incluir funcionalidades como:</Body>
        <BulletList items={[
          'Gestión de proyectos geolocalizados',
          'Asociación de URLs y contenido multimedia',
          'Restricciones por ubicación',
          'Métricas y analítica',
          'Compartición pública de experiencias',
          'Gestión colaborativa de proyectos',
        ]} />
      </Section>

      <Section number="2" title="Registro de cuenta">
        <Body>
          Para acceder a determinadas funcionalidades, el usuario deberá crear una cuenta.
        </Body>
        <Body>El usuario se compromete a:</Body>
        <BulletList items={[
          'Entregar información veraz',
          'Mantener la confidencialidad de sus credenciales',
          'No compartir accesos',
          'Notificar accesos no autorizados',
        ]} />
        <Body>
          El usuario es responsable de toda actividad realizada desde su cuenta.
        </Body>
      </Section>

      <Section number="3" title="Licencia de uso">
        <Body>
          Ubyca concede al usuario una licencia limitada, no exclusiva, revocable e intransferible para
          utilizar la Plataforma conforme a estos términos.
        </Body>
        <Body>No se permite:</Body>
        <BulletList items={[
          'Copiar o revender la Plataforma',
          'Realizar ingeniería inversa',
          'Intentar vulnerar seguridad',
          'Automatizar accesos no autorizados',
          'Utilizar la Plataforma para actividades ilegales',
        ]} />
      </Section>

      <Section number="4" title="Contenido del usuario">
        <Body>
          El usuario conserva la propiedad intelectual de los contenidos cargados.
        </Body>
        <Body>
          Sin embargo, otorga a Ubyca una licencia limitada para almacenar, procesar, mostrar y distribuir
          técnicamente el contenido, exclusivamente con el fin de operar la Plataforma.
        </Body>
        <Body>
          El usuario declara contar con todos los derechos necesarios sobre los contenidos publicados.
        </Body>
      </Section>

      <Section number="5" title="Restricciones de uso">
        <Body>Está prohibido utilizar la Plataforma para:</Body>
        <BulletList items={[
          'Actividades ilegales',
          'Contenido fraudulento',
          'Malware o código malicioso',
          'Infracción de propiedad intelectual',
          'Suplantación de identidad',
          'Recolección no autorizada de datos personales',
          'Actividades que afecten estabilidad o seguridad de la Plataforma',
        ]} />
      </Section>

      <Section number="6" title="Disponibilidad del servicio">
        <Body>
          Ubyca realizará esfuerzos razonables para mantener disponibilidad continua.
        </Body>
        <Body>No obstante:</Body>
        <BulletList items={[
          'El servicio puede presentar interrupciones',
          'Pueden existir errores o fallas',
          'Algunas funcionalidades pueden modificarse o eliminarse',
        ]} />
        <Body>Ubyca no garantiza disponibilidad ininterrumpida.</Body>
      </Section>

      <Section number="7" title="Planes y pagos">
        <Body>
          Algunas funcionalidades de la Plataforma pueden requerir una suscripción pagada.
        </Body>
        <Body>Los pagos:</Body>
        <BulletList items={[
          'Son procesados por proveedores externos de pago',
          'Pueden renovarse automáticamente según el plan contratado',
          'No son reembolsables salvo disposición legal obligatoria',
        ]} />
        <Body>Ubyca podrá en cualquier momento:</Body>
        <BulletList items={[
          'Modificar precios',
          'Cambiar funcionalidades incluidas en cada plan',
          'Ajustar límites de uso, almacenamiento, visitas o proyectos',
          'Crear, modificar o eliminar planes comerciales',
          'Incorporar nuevas funcionalidades sujetas a cobro adicional',
        ]} />
        <Body>
          Cualquier cambio relevante podrá ser comunicado a los usuarios mediante la Plataforma, correo
          electrónico o publicación en el sitio web. El uso continuado de la Plataforma después de la
          entrada en vigencia de dichas modificaciones constituirá aceptación de los nuevos precios o condiciones.
        </Body>
      </Section>

      <Section number="8" title="Reembolsos y cancelaciones">
        <Body>
          Las suscripciones pueden cancelarse en cualquier momento desde la cuenta del usuario o mediante
          contacto con Ubyca.
        </Body>
        <Body>
          Salvo disposición legal obligatoria, los pagos ya procesados no son reembolsables, incluyendo:
        </Body>
        <BulletList items={[
          'Suscripciones activas',
          'Renovaciones automáticas',
          'Servicios utilizados parcial o totalmente',
          'Funcionalidades o planes ya habilitados',
        ]} />
        <Body>
          La cancelación de una suscripción evitará futuros cobros, pero no generará devolución proporcional
          por períodos ya pagados.
        </Body>
      </Section>

      <Section number="9" title="Propiedad intelectual">
        <Body>
          Todos los derechos sobre la Plataforma, incluyendo software, diseño, interfaz, marca, código,
          arquitectura y documentación, pertenecen a Ubyca o sus licenciantes.
        </Body>
        <Body>
          El uso de la Plataforma no transfiere derechos de propiedad intelectual al usuario.
        </Body>
      </Section>

      <Section number="10" title="Limitación de responsabilidad">
        <Body>
          En la máxima medida permitida por la ley, Ubyca no será responsable por:
        </Body>
        <BulletList items={[
          'Pérdida de datos',
          'Interrupciones del servicio',
          'Daños indirectos',
          'Lucro cesante',
          'Errores de geolocalización',
          'Acciones de terceros',
          'Contenido generado por usuarios',
          'Uso indebido de la Plataforma',
        ]} />
        <Body>El usuario utiliza la Plataforma bajo su propio riesgo.</Body>
      </Section>

      <Section number="11" title="Suspensión o cancelación">
        <Body>Ubyca podrá suspender o cancelar cuentas cuando:</Body>
        <BulletList items={[
          'Existan incumplimientos de estos términos',
          'Se detecte actividad sospechosa',
          'Exista riesgo técnico, legal o reputacional',
          'Se produzcan abusos del servicio',
        ]} />
      </Section>

      <Section number="12" title="Integraciones y terceros">
        <Body>
          La Plataforma puede integrarse con servicios externos.
        </Body>
        <Body>Ubyca no controla ni garantiza servicios de terceros.</Body>
        <Body>
          El uso de dichos servicios puede estar sujeto a términos independientes.
        </Body>
      </Section>

      <Section number="13" title="Modificaciones de la Plataforma">
        <Body>
          Ubyca podrá modificar, actualizar o discontinuar funcionalidades en cualquier momento, sin
          obligación de mantener compatibilidad permanente.
        </Body>
      </Section>

      <Section number="14" title="Ley aplicable y jurisdicción">
        <Body>
          Estos Términos y Condiciones se regirán e interpretarán conforme a las leyes de la República de Chile.
        </Body>
        <Body>
          Cualquier controversia, conflicto o reclamación relacionada con el uso de la Plataforma será sometida
          a la jurisdicción de los tribunales competentes de Santiago de Chile, salvo que la legislación aplicable
          del país de residencia del usuario establezca lo contrario.
        </Body>
      </Section>

      <Section number="15" title="Contacto">
        <div className="mt-1">
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
