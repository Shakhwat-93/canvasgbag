@if(!empty($settings['announcementText']))
    <div class="px-4 py-2.5 text-center text-xs font-bold uppercase tracking-[0.18em] bg-[var(--primary)] text-[var(--primary-foreground)] transition-colors duration-300">
        {{ $settings['announcementText'] }}
    </div>
@endif
