import LegalLayout from './LegalLayout'

// ── Local components ──────────────────────────────────────────────────────────

function Section({ number, title, children }: {
  number?: string
  title: string
  children: React.ReactNode
}) {
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

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-200 mb-2.5">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-400 text-sm leading-relaxed">{children}</p>
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
          <span className="w-1 h-1 rounded-full bg-brand-500 flex-shrink-0 mt-2" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function NumberedList({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
          <span className="text-brand-400 font-semibold flex-shrink-0 leading-relaxed">{i + 1}.</span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ol>
  )
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold text-gray-300 pt-1">{children}</p>
}

function Def({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed">
      <span className="text-gray-200 font-semibold">{term}</span>
      <span className="text-slate-400"> {children}</span>
    </p>
  )
}

function Code({ children }: { children: string }) {
  return (
    <code className="text-brand-400 bg-white/[0.05] px-1 py-0.5 rounded text-xs font-mono">
      {children}
    </code>
  )
}

function PolicyTable({ headers, rows }: {
  headers: string[]
  rows: React.ReactNode[][]
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead className="bg-white/[0.03] border-b border-white/[0.07]">
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3.5 text-slate-400 leading-relaxed align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MailLink({ address }: { address: string }) {
  return (
    <a
      href={`mailto:${address}`}
      className="text-brand-400 hover:text-brand-300 transition-colors"
    >
      {address}
    </a>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Política de Privacidad"
      lastUpdated="Última actualización: 25 de junio de 2026"
    >

      {/* Introducción */}
      <div className="space-y-4">
        <Body>
          Ubyca es una plataforma diseñada para activar experiencias digitales en función de
          ubicaciones físicas. Fue construida para responder una pregunta:{' '}
          <strong className="text-gray-200 font-semibold">¿hubo presencia en esta ubicación?</strong>{' '}
          No para responder: ¿quién es esa persona?
        </Body>
        <Body>
          Ningún flujo de la Plataforma exige que un Visitante proporcione su nombre, número de
          identidad civil o cualquier dato que lo identifique directamente. El acceso a experiencias
          geolocalizadas es anónimo por diseño. Aun así, determinados datos técnicos —como coordenadas
          de ubicación registradas en eventos de presencia e identificadores de sesión del navegador—
          pueden constituir datos personales conforme a la legislación aplicable. Esta política
          describe qué tratamos, para qué lo hacemos, cuánto tiempo lo conservamos y cuáles son tus
          derechos.
        </Body>
        <Body>
          La privacidad no es una característica que agregamos al producto. Es parte de cómo lo
          diseñamos.
        </Body>
      </div>

      {/* 1. Alcance */}
      <Section number="1" title="Alcance">
        <Body>Esta política aplica a tres tipos de personas que interactúan con la Plataforma:</Body>
        <BulletList items={[
          <><strong className="text-gray-300 font-semibold">Operadores:</strong>{' '}personas naturales o jurídicas que crean una cuenta en Ubyca Studio para crear, configurar y publicar experiencias geolocalizadas.</>,
          <><strong className="text-gray-300 font-semibold">Visitantes:</strong>{' '}personas que acceden a una experiencia pública publicada por un Operador, sin necesidad de registrarse ni identificarse.</>,
          <><strong className="text-gray-300 font-semibold">Integradores:</strong>{' '}desarrolladores o empresas que consumen la API pública de Ubyca mediante credenciales de acceso.</>,
        ]} />
        <Body>
          Esta política es aplicable con independencia del país desde el que se acceda a la
          Plataforma.
        </Body>
      </Section>

      {/* 2. Definiciones */}
      <Section number="2" title="Definiciones">
        <div className="space-y-3">
          <Def term="Plataforma:">
            el conjunto de servicios, aplicaciones, API y sistemas operados por Ubyca, incluyendo
            Ubyca Studio y las experiencias públicas generadas a través de él.
          </Def>
          <Def term="GeoPoint:">
            punto de interés geolocalizado configurado por un Operador, con una zona de activación
            geográfica (radio o polígono) y contenido o reglas asociadas.
          </Def>
          <Def term="Validación de presencia:">
            proceso técnico mediante el cual la Plataforma determina si el dispositivo de un
            Visitante se encuentra dentro de la zona de activación de un GeoPoint.
          </Def>
          <Def term="Dato personal:">
            cualquier información que identifique o haga identificable a una persona natural,
            conforme a la Ley N.° 21.719 de Chile y demás normativa de protección de datos
            aplicable.
          </Def>
          <Def term="Tratamiento:">
            toda operación efectuada sobre datos personales, incluyendo recopilación,
            almacenamiento, uso, comunicación y eliminación.
          </Def>
          <Def term="Responsable del tratamiento:">
            quien determina los fines y medios del tratamiento de datos personales.
          </Def>
          <Def term="Encargado del tratamiento:">
            quien trata datos personales por cuenta e instrucción del Responsable.
          </Def>
          <Def term="Identificador de sesión:">
            código único generado automáticamente por la Plataforma y almacenado en el dispositivo
            del Visitante. Es de naturaleza técnica y pseudónima; no está vinculado a ninguna
            identidad civil.
          </Def>
        </div>
      </Section>

      {/* 3. ¿Qué información tratamos? */}
      <Section number="3" title="¿Qué información tratamos?">

        <SubSection title="3.1 Operadores">
          <Body>
            Al crear una cuenta y utilizar la Plataforma, tratamos la siguiente información:
          </Body>
          <SubLabel>Proporcionada directamente:</SubLabel>
          <BulletList items={[
            'Nombre y apellido',
            'Dirección de correo electrónico',
            'Nombre de empresa u organización (cuando corresponda)',
            'Contraseña (almacenada exclusivamente en forma cifrada mediante funciones de hash seguras; nunca en texto claro)',
            'Información de facturación (procesada directamente por nuestro proveedor externo de pagos; Ubyca no almacena datos de tarjetas de crédito ni cuentas bancarias)',
          ]} />
          <SubLabel>Generada por el uso de la Plataforma:</SubLabel>
          <BulletList items={[
            'Credenciales de API (clave pública y secreto, este último almacenado en forma hasheada)',
            'Proyectos, GeoPoints, configuraciones y contenido multimedia creados en Studio',
            'Invitaciones a miembros del equipo y sus roles dentro de la organización',
          ]} />
          <SubLabel>Recopilada automáticamente durante el uso de Studio:</SubLabel>
          <BulletList items={[
            'Dirección IP de acceso',
            'Tipo de navegador y sistema operativo',
            'Fecha y hora de las sesiones',
            'Cookies de autenticación necesarias para mantener la sesión activa',
          ]} />
        </SubSection>

        <SubSection title="3.2 Visitantes de experiencias públicas">
          <Body>
            Los Visitantes acceden a las experiencias sin registrarse y sin proporcionar datos de
            identidad. Los datos técnicos que tratamos son los siguientes:
          </Body>

          <SubLabel>Datos de ubicación (con permiso del dispositivo):</SubLabel>
          <Body>
            Las coordenadas GPS del dispositivo —latitud, longitud y precisión— son solicitadas por
            el navegador del propio dispositivo mediante el mecanismo estándar de geolocalización.
            Estos datos se utilizan para determinar si el Visitante se encuentra dentro de la zona
            configurada por el Operador y para registrar los eventos de presencia asociados. Para el
            detalle completo, ver la Sección 4 (Geolocalización).
          </Body>

          <SubLabel>Identificador técnico de sesión:</SubLabel>
          <Body>
            Generamos un identificador único (UUID) para cada navegador que accede a una
            experiencia, que almacenamos en el espacio de almacenamiento local (
            <Code>localStorage</Code>) del dispositivo. Este identificador es pseudónimo: no está
            vinculado a ningún nombre, correo ni identidad civil. Su función es deduplicar eventos
            de analytics, gestionar el estado de la sesión activa y preservar el progreso de
            temporizadores de permanencia entre recargas de página. Ver Sección 7 (Cookies y
            almacenamiento local).
          </Body>

          <SubLabel>Eventos de presencia:</SubLabel>
          <Body>
            Cuando un Visitante activa una experiencia o interactúa con un GeoPoint, la Plataforma
            registra eventos de presencia. Cada evento incluye el tipo de evento, el identificador
            del proyecto y del GeoPoint, la fecha y hora, y el identificador de sesión del
            dispositivo.
          </Body>
          <Body>
            Determinados tipos de eventos —específicamente la entrada a un área de activación, el
            inicio y la completación de temporizadores de permanencia— incluyen las coordenadas GPS
            del dispositivo del Visitante en el momento del evento. Estas coordenadas se utilizan
            para validar la presencia, generar analytics para el Operador, habilitar análisis
            geoespaciales y mejorar las métricas y funcionalidades de la Plataforma.
          </Body>

          <SubLabel>Datos de permanencia (dwell):</SubLabel>
          <Body>
            Si el Operador configura un tiempo mínimo de permanencia como condición de acceso, el
            progreso del temporizador se mantiene en el dispositivo del Visitante. Los datos de
            permanencia se envían al servidor únicamente para registrar el evento de cumplimiento.
          </Body>

          <SubLabel>Datos de visitas activas en tiempo real:</SubLabel>
          <Body>
            Para habilitar funcionalidades de concurrencia en tiempo real —como el conteo de
            Visitantes activos simultáneamente en un GeoPoint—, la Plataforma envía de forma
            periódica, durante la sesión activa, la posición del dispositivo del Visitante y su
            identificador de sesión al servidor. Esta información se utiliza exclusivamente para el
            cálculo de concurrencia en tiempo real y se elimina automáticamente cuando la sesión
            concluye. No se retiene como historial de movimiento.
          </Body>

          <SubLabel>Funcionalidad "Cómo llegar":</SubLabel>
          <Body>
            Si el Visitante activa la funcionalidad de navegación a pie, las coordenadas GPS del
            dispositivo en ese momento (origen) y las coordenadas del GeoPoint de destino son
            enviadas a un proveedor externo de cálculo de rutas para generar el itinerario. Ver
            Sección 8 (Servicios de terceros).
          </Body>
        </SubSection>

        <SubSection title="3.3 Integradores de la API">
          <Body>
            Los Integradores que validan presencia mediante la API pueden transmitir a Ubyca:
          </Body>
          <BulletList items={[
            'Coordenadas GPS de los usuarios de su propio sistema',
            <><Code>user_ref</Code>: referencia de usuario, que debe ser un identificador interno pseudónimo del sistema del Integrador</>,
            <><Code>context.metadata</Code>: metadatos contextuales opcionales</>,
          ]} />
          <Body>
            Ubyca actúa como Encargado del tratamiento de estos datos, procesándolos bajo las
            instrucciones del Integrador, que actúa como Responsable. Ver Sección 5 (Roles en el
            tratamiento).
          </Body>
        </SubSection>

      </Section>

      {/* 4. Geolocalización */}
      <Section number="4" title="Geolocalización">
        <Body>
          Este apartado describe con precisión cómo Ubyca trata los datos de ubicación. Es uno de
          los aspectos más relevantes de nuestra política y queremos ser completamente transparentes
          al respecto.
        </Body>

        <SubSection title="4.1 Para qué usamos los datos de ubicación">
          <Body>
            La finalidad del tratamiento de datos de ubicación durante una sesión activa es:
            determinar en tiempo real si el dispositivo del Visitante se encuentra dentro de la zona
            de activación configurada por el Operador, registrar los eventos de presencia resultantes
            y generar los analytics asociados.
          </Body>
          <Body>
            Ubyca fue diseñada para responder la pregunta:{' '}
            <strong className="text-gray-200 font-semibold">
              ¿está este dispositivo dentro del área configurada?
            </strong>
          </Body>
          <Body>
            No fue diseñada para responder: ¿quién es esta persona?, ¿cuál es su historial de
            desplazamientos?, ¿adónde va?
          </Body>
        </SubSection>

        <SubSection title="4.2 Cómo funciona el tratamiento de ubicación">
          <Body>
            El permiso de GPS lo gestiona el propio navegador del dispositivo, mediante un diálogo
            estándar que el Visitante puede aceptar o rechazar. Si el Visitante deniega el permiso,
            la validación de presencia no puede realizarse. El permiso puede revocarse en cualquier
            momento desde la configuración del navegador o del sistema operativo.
          </Body>
          <Body>
            Durante la sesión activa, la Plataforma procesa los datos de ubicación del dispositivo
            para:
          </Body>
          <BulletList items={[
            'Verificar en tiempo real si el Visitante se encuentra dentro de la zona de activación.',
            'Registrar eventos de presencia. Los eventos de entrada a áreas, inicio y completación de permanencia incluyen las coordenadas GPS del dispositivo en el momento del evento. Estas coordenadas quedan registradas en los sistemas de Ubyca y están disponibles para el análisis de los Operadores conforme a la Sección 6.',
            'Gestionar el conteo de visitas activas en tiempo real mediante transmisión periódica de posición al servidor durante la sesión.',
          ]} />
          <Body>
            Los eventos GPS que se registran corresponden a momentos específicos de activación o
            validación, no a trayectorias continuas de movimiento.
          </Body>
        </SubSection>

        <SubSection title="4.3 Nivel de precisión utilizado">
          <Body>
            Ubyca solicita la mayor precisión disponible del dispositivo porque la validación en
            geocercas de precisión así lo requiere. La precisión efectiva depende del dispositivo y
            de las condiciones de conectividad. Ubyca no garantiza exactitud absoluta.
          </Body>
        </SubSection>

        <SubSection title="4.4 Lo que Ubyca no hace con los datos de ubicación">
          <BulletList items={[
            'No construye perfiles de movimiento de Visitantes a lo largo del tiempo ni entre sesiones.',
            'No vende datos de ubicación a terceros.',
            'No comparte coordenadas GPS individuales de Visitantes con Operadores para fines de identificación personal.',
            'No cruza datos de ubicación con bases de datos de identidad civil.',
            'No utiliza datos de ubicación para finalidades publicitarias o de perfilado comercial.',
            'No retiene datos de posición en tiempo real una vez concluida la sesión activa.',
          ]} />
        </SubSection>

        <SubSection title="4.5 Lo que el Operador accede">
          <Body>
            El Operador accede a métricas de presencia: cuántas veces se activó un área, en qué
            horarios, en qué días, y la distribución geográfica agregada de los eventos. El Operador
            no accede a la posición GPS individual de ningún Visitante concreto ni a su identificador
            de sesión.
          </Body>
        </SubSection>

        <SubSection title="4.6 Responsabilidad del Operador">
          <Body>
            El Operador que crea una experiencia geolocalizada es responsable de informar
            adecuadamente a sus Visitantes sobre el uso de la Plataforma y de contar con la base
            legal que corresponda conforme a la legislación de su jurisdicción. Esta obligación está
            recogida en los Términos y Condiciones de Ubyca.
          </Body>
        </SubSection>

      </Section>

      {/* 5. Roles */}
      <Section number="5" title="Roles en el tratamiento de datos">
        <Body>
          Ubyca puede actuar en distintos roles según el flujo de datos y la relación contractual:
        </Body>
        <Body>
          <strong className="text-gray-200 font-semibold">Como Responsable del tratamiento</strong>,
          Ubyca determina los fines y medios del tratamiento de datos de sus Operadores (registro,
          cuenta, facturación, soporte y administración de Studio), así como de los datos técnicos
          de Visitantes utilizados para operar, mantener y mejorar la Plataforma.
        </Body>
        <Body>
          <strong className="text-gray-200 font-semibold">Como Encargado del tratamiento</strong>,
          Ubyca procesa datos de visitantes o usuarios del Operador o del Integrador únicamente para
          prestar el servicio contratado. En estos casos, el Operador o el Integrador actúa como
          Responsable y asume la obligación de contar con la base legal correspondiente y de informar
          a sus propios usuarios.
        </Body>
        <Body>
          Esta distinción se documenta en el Acuerdo de Tratamiento de Datos (DPA) disponible para
          Operadores e Integradores que lo requieran. El DPA forma parte del contrato de servicio en
          todos los casos en que Ubyca trate datos de terceros por cuenta del cliente.
        </Body>
      </Section>

      {/* 6. Finalidades */}
      <Section number="6" title="Finalidades y bases legales del tratamiento">

        <SubSection title="Operadores">
          <PolicyTable
            headers={['Finalidad', 'Base legal (Ley 21.719)']}
            rows={[
              ['Creación y gestión de cuenta', 'Ejecución del contrato de servicio (art. 12.b)'],
              ['Procesamiento de pagos y facturación', 'Ejecución del contrato (art. 12.b)'],
              ['Prestación de las funcionalidades de Studio', 'Ejecución del contrato (art. 12.b)'],
              ['Comunicaciones operativas del servicio', 'Ejecución del contrato / Interés legítimo (art. 12.f)'],
              ['Seguridad de la cuenta y prevención de fraude', 'Interés legítimo de Ubyca (art. 12.f)'],
              ['Cumplimiento de obligaciones legales y regulatorias', 'Cumplimiento de obligación legal (art. 12.c)'],
              ['Mejora de la Plataforma a partir de su uso agregado', 'Interés legítimo de Ubyca (art. 12.f)'],
            ]}
          />
        </SubSection>

        <SubSection title="Visitantes">
          <PolicyTable
            headers={['Finalidad', 'Base legal (Ley 21.719)']}
            rows={[
              ['Validación de presencia geográfica en tiempo real', 'Interés legítimo del Operador en prestar la experiencia contratada y de Ubyca en proveer el servicio (art. 12.f)'],
              ['Registro de eventos de presencia con coordenadas GPS', 'Interés legítimo del Operador en analizar su experiencia y de Ubyca en proveer analytics fiables (art. 12.f)'],
              ['Deduplicación de eventos para calidad de métricas', 'Interés legítimo de Ubyca (art. 12.f)'],
              ['Gestión de concurrencia activa en tiempo real', 'Interés legítimo del Operador (art. 12.f)'],
              ['Cálculo de rutas a pie ("Cómo llegar")', 'Interés legítimo del Visitante en acceder al GeoPoint (art. 12.f)'],
              ['Seguridad y estabilidad técnica del servicio', 'Interés legítimo de Ubyca (art. 12.f)'],
            ]}
          />
          <Body>
            Cuando el tratamiento se basa en interés legítimo, Ubyca ha evaluado que dicho interés
            es real, específico y proporcional a los datos utilizados. En el caso del registro de
            coordenadas GPS en eventos de presencia, este tratamiento resulta necesario para el
            funcionamiento de la funcionalidad contratada y para la generación de analytics que el
            Operador ha solicitado expresamente.
          </Body>
        </SubSection>

        <SubSection title="Integradores API">
          <Body>
            El tratamiento de datos enviados por el Integrador se realiza sobre la base de la
            ejecución del contrato de servicio y conforme al Acuerdo de Tratamiento de Datos
            suscrito entre Ubyca y el Integrador.
          </Body>
        </SubSection>

      </Section>

      {/* 7. Cookies */}
      <Section number="7" title="Cookies y tecnologías de almacenamiento local">
        <Body>
          Ubyca utiliza tecnologías de almacenamiento en el navegador del usuario. A continuación
          describimos cada una con precisión:
        </Body>

        <SubSection title="7.1 Cookies de sesión autenticada (Operadores)">
          <Body>
            Cuando el Operador inicia sesión en Studio, utilizamos cookies de sesión para mantener
            la autenticación activa. Sin estas cookies, el acceso a Studio no es posible.
          </Body>
          <BulletList items={[
            <><strong className="text-gray-300">Tipo:</strong> Estrictamente necesarias</>,
            <><strong className="text-gray-300">Duración:</strong> Sesión activa del navegador o hasta que el Operador cierra sesión</>,
          ]} />
        </SubSection>

        <SubSection title="7.2 Identificador de sesión del Visitante (localStorage)">
          <Body>
            Almacenamos un identificador único (UUID) en el espacio <Code>localStorage</Code> del
            navegador bajo la clave <Code>ubyca:session_id</Code>.
          </Body>
          <BulletList items={[
            <><strong className="text-gray-300">Propósito:</strong> Deduplicar eventos de analytics, gestionar el estado de la visita activa y preservar el progreso de temporizadores de permanencia entre recargas.</>,
            <><strong className="text-gray-300">Naturaleza:</strong> Pseudónimo. No está vinculado a ningún nombre, correo ni identidad civil. No se comparte con el Operador ni con terceros para fines de identificación individual.</>,
            <><strong className="text-gray-300">Duración:</strong> Persiste en el navegador hasta que el Visitante borra los datos del sitio, o hasta 12 meses desde su creación.</>,
            <><strong className="text-gray-300">Tipo:</strong> Funcional / analítico necesario para la prestación del servicio</>,
          ]} />
          <Body>
            El Visitante puede eliminar este identificador en cualquier momento limpiando el{' '}
            <Code>localStorage</Code> de su navegador o borrando los datos del sitio desde la
            configuración del navegador.
          </Body>
        </SubSection>

        <SubSection title="7.3 Marcas de deduplicación de eventos (localStorage)">
          <Body>
            Para evitar el registro múltiple del mismo evento de presencia en el mismo día,
            almacenamos marcas en el <Code>localStorage</Code> bajo claves del
            formato <Code>{'analytics:{tipo}:{proyecto}:{punto}:{fecha}'}</Code>.
          </Body>
          <BulletList items={[
            <><strong className="text-gray-300">Propósito:</strong> Calidad de las métricas de analytics del Operador.</>,
            <><strong className="text-gray-300">Duración:</strong> Expiran al cambio de día calendario.</>,
            <><strong className="text-gray-300">Tipo:</strong> Funcional</>,
          ]} />
        </SubSection>

        <SubSection title="7.4 Estado de permanencia (localStorage)">
          <Body>
            Si el Operador configura un tiempo mínimo de permanencia como condición de acceso, el
            progreso del temporizador se almacena localmente bajo claves del
            formato <Code>{'ubyca:dwell:{proyecto}:{punto}'}</Code>.
          </Body>
          <BulletList items={[
            <><strong className="text-gray-300">Propósito:</strong> Preservar el progreso del Visitante entre recargas de página durante la misma experiencia.</>,
            <><strong className="text-gray-300">Duración:</strong> 24 horas desde su creación.</>,
            <><strong className="text-gray-300">Tipo:</strong> Funcional</>,
          ]} />
        </SubSection>

        <SubSection title="7.5 Cookies de servicios de terceros">
          <Body>
            Algunos componentes operativos de la Plataforma pueden cargar servicios de terceros que
            instalen sus propias cookies o tecnologías de rastreo. Estos servicios están sujetos a
            sus propias políticas de privacidad.
          </Body>
        </SubSection>

      </Section>

      {/* 8. Terceros */}
      <Section number="8" title="Servicios de terceros">
        <Body>Para operar la Plataforma, Ubyca utiliza los siguientes proveedores externos:</Body>
        <PolicyTable
          headers={['Proveedor', 'Función', 'Datos compartidos']}
          rows={[
            [
              <strong className="text-gray-300">Vercel</strong>,
              'Infraestructura del frontend — hosting, edge delivery y distribución global',
              'Datos técnicos de acceso (IPs, headers HTTP)',
            ],
            [
              <strong className="text-gray-300">Railway</strong>,
              'Infraestructura del backend y base de datos — procesamiento y almacenamiento',
              'Datos operativos de la Plataforma, incluyendo eventos de presencia y analytics',
            ],
            [
              <strong className="text-gray-300">Paddle</strong>,
              'Procesamiento de pagos y gestión de suscripciones',
              'Datos de facturación del Operador',
            ],
            [
              <strong className="text-gray-300">OpenRouteService</strong>,
              'Cálculo de rutas a pie para la funcionalidad "Cómo llegar"',
              'Coordenadas GPS del Visitante (origen) y coordenadas del GeoPoint (destino)',
            ],
            [
              <strong className="text-gray-300">OpenStreetMap / Nominatim</strong>,
              'Visualización de direcciones de GeoPoints en el mapa',
              'Coordenadas de los GeoPoints configurados por el Operador',
            ],
          ]}
        />
        <Body>
          Los proveedores que tratan datos por cuenta de Ubyca están sujetos a acuerdos
          contractuales de confidencialidad y tratamiento de datos. Ubyca no vende datos a ningún
          proveedor. No utilizamos datos de Visitantes con fines publicitarios ni de perfilado
          comercial externo.
        </Body>
        <Body>
          Ubyca actualizará esta sección cuando incorpore o sustituya proveedores con acceso a datos
          personales.
        </Body>
      </Section>

      {/* 9. Conservación */}
      <Section number="9" title="Conservación de datos">
        <Body>
          Los datos se retienen únicamente durante el tiempo necesario para cumplir la finalidad que
          motivó su recopilación, conforme al principio de conservación limitada.
        </Body>
        <PolicyTable
          headers={['Categoría', 'Período de retención']}
          rows={[
            ['Datos de cuenta del Operador (nombre, email, empresa)', 'Vigencia del contrato + 5 años'],
            ['Contraseña del Operador (hash)', 'Vigencia de la cuenta activa'],
            ['Registros de actividad y acceso del Operador', '90 días'],
            ['Eventos de analytics de Visitantes (incluidas coordenadas GPS de eventos)', '24 meses'],
            ['Sesiones activas en tiempo real', 'Eliminadas automáticamente a las 4 horas de inactividad'],
            ['Datos de posición transmitidos durante sesión activa', 'No se retienen una vez finalizada la sesión'],
            ['Logs de servidor y registros de seguridad', '30 a 90 días'],
            ['Copias de seguridad', '90 días con rotación programada'],
            ['Datos de facturación', 'Conforme a la normativa tributaria chilena vigente'],
          ]}
        />
        <Body>
          El identificador de sesión del Visitante (<Code>localStorage</Code>) persiste en el
          dispositivo hasta que el Visitante lo elimina o hasta 12 meses desde su creación, lo que
          ocurra primero.
        </Body>
      </Section>

      {/* 10. Derechos */}
      <Section number="10" title="Derechos de los titulares">
        <Body>
          Conforme a la Ley N.° 21.719 de Chile y demás normativa de protección de datos aplicable,
          los titulares tienen los siguientes derechos:
        </Body>
        <BulletList items={[
          <><strong className="text-gray-300">Acceso:</strong> Conocer qué datos personales tratamos sobre usted y obtener una copia.</>,
          <><strong className="text-gray-300">Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos.</>,
          <><strong className="text-gray-300">Cancelación / Supresión:</strong> Solicitar la eliminación de sus datos cuando no exista base legal que justifique su conservación.</>,
          <><strong className="text-gray-300">Oposición:</strong> Oponerse a tratamientos basados en interés legítimo cuando existan motivos fundados relativos a su situación particular.</>,
          <><strong className="text-gray-300">Portabilidad:</strong> Recibir sus datos en un formato estructurado y legible por máquina cuando el tratamiento se realice por medios automatizados.</>,
          <><strong className="text-gray-300">Limitación del tratamiento:</strong> Solicitar la suspensión del tratamiento en determinadas circunstancias mientras se resuelve una solicitud de rectificación u oposición.</>,
        ]} />

        <SubSection title="Cómo ejercer sus derechos">
          <Body>
            <strong className="text-gray-300">Si eres Operador:</strong>{' '}
            puedes acceder, modificar y eliminar la mayoría de tus datos directamente desde la
            configuración de tu cuenta en Studio. Para solicitudes adicionales, escríbenos a{' '}
            <MailLink address="contacto@ubyca.com" />.
          </Body>
          <Body>
            <strong className="text-gray-300">Si eres Visitante:</strong>{' '}
            dado que el acceso a las experiencias no requiere identificación, tus datos están
            asociados únicamente al identificador técnico de sesión almacenado en tu dispositivo.
            Puedes:
          </Body>
          <NumberedList items={[
            <>
              Eliminar tu identificador de sesión directamente borrando el almacenamiento local (
              <Code>localStorage</Code>) de tu navegador para el sitio de Ubyca. Esto interrumpe el
              vínculo entre tu dispositivo y los eventos previos registrados.
            </>,
            <>
              Solicitar la eliminación de los eventos asociados a tu sesión escribiendo
              a <MailLink address="contacto@ubyca.com" /> e indicando el valor de tu identificador
              de sesión, que puedes encontrar en el <Code>localStorage</Code> de tu navegador bajo
              la clave <Code>ubyca:session_id</Code>.
            </>,
          ]} />
          <Body>
            Una vez que los eventos han sido integrados en métricas estadísticas agregadas y el
            identificador de sesión ha sido desvinculado de dichos datos, la eliminación individual
            puede no ser técnicamente posible en todos los casos. En tales situaciones, lo
            informaremos al titular explicando el estado técnico de sus datos.
          </Body>
        </SubSection>

        <SubSection title="Plazos de respuesta">
          <Body>
            Respondemos todas las solicitudes dentro de los{' '}
            <strong className="text-gray-300">30 días hábiles</strong>{' '}
            siguientes a su recepción. En casos que requieran mayor análisis, podemos extender ese
            plazo hasta 60 días hábiles, notificándolo por escrito.
          </Body>
        </SubSection>

        <SubSection title="Reclamaciones">
          <Body>
            Si consideras que el tratamiento de tus datos no cumple con la normativa aplicable,
            tienes derecho a presentar una reclamación ante la Agencia de Protección de Datos
            Personales de Chile o ante la autoridad de control competente en tu país de residencia.
          </Body>
        </SubSection>

      </Section>

      {/* 11. Seguridad */}
      <Section number="11" title="Seguridad">
        <Body>
          La protección de la información es parte del diseño de Ubyca, no una capa adicional.
          Implementamos las siguientes medidas técnicas y organizativas:
        </Body>
        <BulletList items={[
          'Cifrado de todas las comunicaciones entre el dispositivo del usuario y los servidores de Ubyca mediante TLS/HTTPS.',
          'Almacenamiento de contraseñas exclusivamente mediante funciones de hash criptográfico seguro.',
          'Credenciales de API con principio de mínimo privilegio: cada credencial tiene únicamente los scopes necesarios para la función asignada.',
          'Control de acceso basado en roles dentro de los equipos del Operador, con separación de permisos entre propietario, editor y visualizador.',
          'Monitoreo técnico de accesos y detección de anomalías.',
          'Procedimientos internos de respuesta ante incidentes de seguridad.',
        ]} />
        <Body>
          Ningún sistema de seguridad ofrece garantías absolutas. En caso de una brecha de seguridad
          que afecte datos personales y que suponga un riesgo para los titulares, Ubyca cumplirá con
          los plazos y procedimientos de notificación establecidos por la Ley N.° 21.719, incluyendo
          la notificación a la Agencia de Protección de Datos Personales y, cuando corresponda, a
          los propios titulares.
        </Body>
      </Section>

      {/* 12. Transferencias */}
      <Section number="12" title="Transferencias internacionales de datos">
        <Body>
          Para operar la Plataforma, Ubyca utiliza infraestructura y proveedores que pueden estar
          ubicados fuera del territorio de Chile. Vercel, Railway, Paddle y OpenRouteService operan
          con infraestructura en distintas regiones del mundo. Cuando los datos personales sean
          transferidos a países que no cuenten con un nivel de protección equivalente al establecido
          por la Ley N.° 21.719, Ubyca adoptará las garantías adecuadas, que pueden incluir:
        </Body>
        <BulletList items={[
          'Cláusulas contractuales estándar de protección de datos.',
          'Acuerdos específicos de tratamiento de datos con los destinatarios.',
          'Verificación del nivel adecuado de protección en el país destinatario conforme a los mecanismos previstos en la ley.',
        ]} />
        <Body>
          Para información específica sobre las garantías adoptadas en cada caso, puedes contactarnos
          en <MailLink address="contacto@ubyca.com" />.
        </Body>
      </Section>

      {/* 13. Menores */}
      <Section number="13" title="Menores de edad">
        <Body>
          Ubyca no está dirigida a personas menores de 14 años y no recopila conscientemente datos
          personales de menores sin el consentimiento de sus padres o representantes legales.
        </Body>
        <Body>
          Si el Operador diseña una experiencia dirigida a menores de edad, asume la responsabilidad
          de obtener los consentimientos necesarios conforme a la normativa aplicable y de informar a
          Ubyca de dicha circunstancia.
        </Body>
        <Body>
          Si Ubyca tuviera conocimiento de haber tratado datos de un menor sin el consentimiento
          requerido, procederá a su eliminación a la mayor brevedad.
        </Body>
      </Section>

      {/* 14. Cambios */}
      <Section number="14" title="Cambios a esta política">
        <Body>
          Ubyca puede actualizar esta Política de Privacidad para reflejar cambios en la Plataforma,
          en la normativa aplicable o en nuestras prácticas de tratamiento.
        </Body>
        <Body>
          Las actualizaciones que afecten de manera relevante los derechos de los titulares o las
          categorías de datos tratados serán comunicadas a los Operadores mediante correo electrónico
          o aviso dentro de Studio, con al menos{' '}
          <strong className="text-gray-300">15 días de anticipación</strong>{' '}
          a su entrada en vigencia.
        </Body>
        <Body>
          La versión actualizada estará siempre disponible en esta URL con la fecha de actualización
          indicada en el encabezado del documento.
        </Body>
        <Body>
          El uso continuado de la Plataforma una vez entrada en vigencia la nueva versión implica la
          aceptación de los cambios. Si no estás de acuerdo con las modificaciones, puedes cancelar
          tu cuenta antes de la fecha de entrada en vigencia.
        </Body>
      </Section>

      {/* 15. Contacto */}
      <Section number="15" title="Contacto">
        <Body>
          Para consultas, solicitudes de ejercicio de derechos o cualquier asunto relacionado con
          esta Política de Privacidad:
        </Body>
        <div className="mt-3">
          <a
            href="mailto:contacto@ubyca.com"
            className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            contacto@ubyca.com
          </a>
        </div>
        <Body>
          Ubyca responderá dentro de los 30 días hábiles siguientes a la recepción de tu solicitud.
        </Body>
      </Section>

      {/* Nota legal final */}
      <p className="text-slate-500 text-xs leading-relaxed italic border-t border-white/[0.06] pt-8">
        Esta Política de Privacidad está redactada conforme a la Ley N.° 21.719 de Protección de
        Datos Personales de la República de Chile y refleja las buenas prácticas internacionales
        aplicables a plataformas SaaS B2B.
      </p>

    </LegalLayout>
  )
}
